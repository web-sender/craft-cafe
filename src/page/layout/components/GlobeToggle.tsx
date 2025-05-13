'use client';

import React, { useEffect, useRef, memo } from 'react';
import styles from '@/styles/layout/header/component.module.css';

// Интерфейс пропсов компонента
interface GlobeToggleProps {
    isActive: boolean; // Активное состояние (локаль смещена и уменьшена)
    isPending: boolean; // Состояние ожидания (вращение планеты)
    onToggle: () => void; // Функция, вызываемая при клике
    locale: string; // Текущая локаль ('ru', 'en', 'zh' и т.д.)
}

// Константы для Canvas и анимаций
const CANVAS_WIDTH = 120;
const CANVAS_HEIGHT = 120;
const CENTER_X = CANVAS_WIDTH / 2;
const CENTER_Y = CANVAS_HEIGHT / 2;
const PLANET_RADIUS = 36;
const PARALLEL_COUNT = 12; // Количество параллелей
const LINE_WIDTH = 1
const LOCALE_FONT = 'bold 36px Arial'; // Шрифт для локали
const LOCALE_Y_OFFSET = 16; // Смещение локали вниз от центра
const LOCALE_ACTIVE_OFFSET_X = 10; // Смещение локали вправо при isActive
const LOCALE_ACTIVE_SCALE = 0.8; // Уменьшение локали при isActive
const LOCALE_ANIMATION_OFFSET_X = -40; // Смещение влево при isPending
const LOCALE_REAPPEAR_OFFSET_X = 40; // Начальная позиция справа при появлении
const LOCALE_REAPPEAR_SCALE = 0.5; // Начальный масштаб при появлении
const LOCALE_ANIMATION_SPEED = 0.05; // Скорость анимации текста
const ROTATION_SPEED = 0.05; // Скорость вращения планеты (радианы за кадр)
const LOCALE_REAPPEAR_DELAY = 300; // Задержка появления локали после isPending (мс)

// Интерфейс состояния анимации
interface AnimationState {
    rotationAngle: number; // Угол вращения планеты
    localeOpacity: number; // Прозрачность локали
    localeOffsetX: number; // Горизонтальное смещение локали
    localeScale: number; // Масштаб локали
    isAnimating: boolean; // Флаг выполнения анимации
    isTextAppearing: boolean; // Флаг анимации появления текста
    animationFrameId?: number; // ID для requestAnimationFrame
}

// Создание градиента для планеты
function createPlanetGradient(ctx: CanvasRenderingContext2D, scaledRadius: number): CanvasGradient {
    const gradient = ctx.createRadialGradient(
        CENTER_X - scaledRadius * 0.3,
        CENTER_Y - scaledRadius * 0.3,
        scaledRadius * 0.2,
        CENTER_X,
        CENTER_Y,
        scaledRadius
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(1, 'rgba(100, 100, 100, 0.9)');
    return gradient;
}

// Отрисовка фона с градиентом
function drawBackground(ctx: CanvasRenderingContext2D) {
    const bgGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    bgGradient.addColorStop(0, 'rgba(40, 40, 40, 1)');
    bgGradient.addColorStop(1, 'rgba(10, 10, 10, 1)');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

// Отрисовка текстуры шума
function drawNoise(ctx: CanvasRenderingContext2D) {
    const imageData = ctx.createImageData(CANVAS_WIDTH, CANVAS_HEIGHT);
    for (let i = 0; i < imageData.data.length; i += 4) {
        const noise = Math.random() * 40;
        imageData.data[i] = noise;
        imageData.data[i + 1] = noise;
        imageData.data[i + 2] = noise;
        imageData.data[i + 3] = 8; // Низкая прозрачность
    }
    ctx.putImageData(imageData, 0, 0);
}

// Отрисовка планеты
function drawPlanet(
    ctx: CanvasRenderingContext2D,
    scaledRadius: number,
    rotationAngle: number,
    planetGradientRef: React.MutableRefObject<CanvasGradient | null>,
): void {
    // Создание градиента, если он отсутствует
    if ('current' in planetGradientRef && !planetGradientRef.current) {
        planetGradientRef.current = createPlanetGradient(ctx, scaledRadius);
    }
    
    // Локальная переменная с суженным типом
    const gradient = planetGradientRef.current;
    if (!gradient) return; // На случай ошибки

    // Отрисовка сферы
    ctx.save();
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, scaledRadius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.restore();
    
    // Отрисовка параллелей (горизонтальные эллипсы, шире на экваторе)
    ctx.save();
    ctx.translate(CENTER_X, CENTER_Y);
    for (let i = 1; i < PARALLEL_COUNT - 1; i++) { // Пропускаем полюса
        // Позиция параллели: от -0.5 (южный полюс) до +0.5 (северный полюс)
        const t = i / (PARALLEL_COUNT - 1); // 0..1
        const yPos = (t - 0.5) * scaledRadius * 2.5; // Смещение по Y
        // Радиус параллели: максимум на экваторе (t = 0.5)
        const parallelRadiusX = scaledRadius * Math.sin(t * Math.PI); // Максимум на экваторе
        const parallelRadiusY = scaledRadius * 0.1; // Меньшая высота эллипса
        // Пропускаем, если радиус слишком мал
        if (parallelRadiusX < 15) continue;
        ctx.beginPath();
        ctx.ellipse(0, yPos, parallelRadiusX, parallelRadiusY, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.lineWidth = LINE_WIDTH;
        ctx.stroke();
    }
    ctx.restore();

    // Отрисовка тени для объёмности
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, scaledRadius * 1.1, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fill();
    ctx.restore();
}

// Отрисовка текста локали
function drawLocale(
    ctx: CanvasRenderingContext2D,
    locale: string,
    isActive: boolean,
    localeOpacity: number,
    localeOffsetX: number,
    localeScale: number
) {
    ctx.save();
    ctx.font = LOCALE_FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = `rgba(255, 255, 255, ${localeOpacity})`;
    const baseX = isActive ? CENTER_X + LOCALE_ACTIVE_OFFSET_X : CENTER_X;
    const x = baseX + localeOffsetX; // Добавляем анимированное смещение
    const baseScale = isActive ? LOCALE_ACTIVE_SCALE : 1;
    const scale = baseScale * localeScale; // Комбинируем базовый и анимированный масштаб
    ctx.translate(x, CENTER_Y + LOCALE_Y_OFFSET);
    ctx.scale(scale, scale);
    ctx.fillText(locale.toUpperCase(), 0, 0);
    ctx.restore();
}

// Обновление состояния анимации
function updateAnimation(
    state: AnimationState,
    isActive: boolean,
    isPending: boolean,
    setLocaleOpacity: (opacity: number) => void,
    setLocaleOffsetX: (offset: number) => void,
    setLocaleScale: (scale: number) => void
) {
    if (isPending) {
        // Анимация вращения и уплывания текста влево
        state.isAnimating = true;
        state.rotationAngle += ROTATION_SPEED;
        state.localeOpacity -= LOCALE_ANIMATION_SPEED; // Плавное исчезновение
        if (state.localeOpacity < 0) state.localeOpacity = 0;
        state.localeOffsetX -= LOCALE_ANIMATION_SPEED * Math.abs(LOCALE_ANIMATION_OFFSET_X); // Смещение влево
        if (state.localeOffsetX < LOCALE_ANIMATION_OFFSET_X) state.localeOffsetX = LOCALE_ANIMATION_OFFSET_X;
        state.localeScale -= LOCALE_ANIMATION_SPEED; // Уменьшение масштаба
        if (state.localeScale < LOCALE_REAPPEAR_SCALE) state.localeScale = LOCALE_REAPPEAR_SCALE;
        state.isTextAppearing = false;
    } else if (state.isAnimating) {
        // Завершение анимации: запуск задержки для появления текста
        state.isAnimating = false;
        state.localeOffsetX = LOCALE_REAPPEAR_OFFSET_X; // Начальная позиция справа
        state.localeOpacity = 0;
        state.localeScale = LOCALE_REAPPEAR_SCALE; // Начальный масштаб
        state.isTextAppearing = true;
        setTimeout(() => {
            setLocaleOpacity(1); // Плавное появление
            setLocaleOffsetX(0); // Возврат к центру
            setLocaleScale(isActive ? LOCALE_ACTIVE_SCALE : 1); // Нормальный масштаб
        }, LOCALE_REAPPEAR_DELAY);
    } else if (state.isTextAppearing) {
        // Анимация появления текста
        state.localeOpacity += LOCALE_ANIMATION_SPEED;
        if (state.localeOpacity > 1) state.localeOpacity = 1;
        state.localeOffsetX -= LOCALE_ANIMATION_SPEED * LOCALE_REAPPEAR_OFFSET_X; // Смещение к центру
        if (state.localeOffsetX < 0) state.localeOffsetX = 0;
        state.localeScale += LOCALE_ANIMATION_SPEED; // Увеличение масштаба
        if (state.localeScale > (isActive ? LOCALE_ACTIVE_SCALE : 1)) {
            state.localeScale = isActive ? LOCALE_ACTIVE_SCALE : 1;
            state.isTextAppearing = false;
        }
    }
}

// Основной цикл анимации
function animate(
    ctx: CanvasRenderingContext2D,
    state: AnimationState,
    isActive: boolean,
    isPending: boolean,
    locale: string,
    planetGradientRef: React.MutableRefObject<CanvasGradient | null>,
    setLocaleOpacity: (opacity: number) => void,
    setLocaleOffsetX: (offset: number) => void,
    setLocaleScale: (scale: number) => void
) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Отрисовка фона и шума
    drawBackground(ctx);
    drawNoise(ctx);

    // Отрисовка планеты
    const breathe = Math.sin(Date.now() / 1000) * 0.04 + 1; // Эффект дыхания
    const scaledRadius = PLANET_RADIUS * breathe;
   
    drawPlanet(ctx, scaledRadius, state.rotationAngle, planetGradientRef);

    // Отрисовка локали
    drawLocale(ctx, locale, isActive, state.localeOpacity, state.localeOffsetX, state.localeScale);

    // Обновление анимации
    updateAnimation(state, isActive, isPending, setLocaleOpacity, setLocaleOffsetX, setLocaleScale);

    // Продолжение анимации
    state.animationFrameId = requestAnimationFrame(() =>
        animate(ctx, state, isActive, isPending, locale, planetGradientRef, setLocaleOpacity, setLocaleOffsetX, setLocaleScale)
    );
}

// Обработчик клика
function handleClick(isPending: boolean, onToggle: () => void) {
    if (isPending) return; // Блокировка кликов во время isPending
    onToggle();
}

// Компонент переключателя локалей
const GlobeToggle: React.FC<GlobeToggleProps> = ({ isActive, isPending, onToggle, locale }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const localeOpacityRef = useRef(1); // Прозрачность локали
    const localeOffsetXRef = useRef(0); // Смещение локали
    const localeScaleRef = useRef(1); // Масштаб локали
    const planetGradientRef = useRef<CanvasGradient | null>(null);

    // Функции для обновления состояния
    const setLocaleOpacity = (opacity: number) => {
        localeOpacityRef.current = opacity;
    };

    const setLocaleOffsetX = (offset: number) => {
        localeOffsetXRef.current = offset;
    };

    const setLocaleScale = (scale: number) => {
        localeScaleRef.current = scale;
    };

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d')!;
        ctx.imageSmoothingEnabled = true; // Включение сглаживания

        // Инициализация состояния анимации
        const state: AnimationState = {
            rotationAngle: 0,
            localeOpacity: 1,
            localeOffsetX: 0,
            localeScale: isActive ? LOCALE_ACTIVE_SCALE : 1, // Начальный масштаб
            isAnimating: false,
            isTextAppearing: false
        };

        // Инициализация обработчика клика
        const clickHandler = () => handleClick(isPending, onToggle);
        canvas.addEventListener('click', clickHandler);

        // Запуск анимации
        animate(ctx, state, isActive, isPending, locale, planetGradientRef, setLocaleOpacity, setLocaleOffsetX, setLocaleScale);

        // Очистка при размонтировании
        return () => {
            if (state.animationFrameId) {
                cancelAnimationFrame(state.animationFrameId);
            }
            canvas.removeEventListener('click', clickHandler);
        };
    }, [isActive, isPending, locale, onToggle]);

    // Синхронизация прозрачности, смещения и масштаба локали
    useEffect(() => {
        if (!isPending && !localeOpacityRef.current) {
            setLocaleOpacity(0);
            setLocaleOffsetX(LOCALE_REAPPEAR_OFFSET_X);
            setLocaleScale(LOCALE_REAPPEAR_SCALE); // Уменьшенный масштаб
            localeOpacityRef.current = 0; // Принудительное обновление
        }
    }, [isPending]);

    return <canvas ref={canvasRef} width={120} height={120} className={styles.canvas} />;
};

// Экспорт компонента с memo
export default memo(GlobeToggle);