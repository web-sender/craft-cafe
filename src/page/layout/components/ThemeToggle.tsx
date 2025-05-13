'use client';

import React, { useEffect, useRef, memo } from 'react';
import styles from '@/styles/layout/header/component.module.css';

// Интерфейс пропсов компонента
interface ThemeToggleProps {
    onToggle: (nextTheme: 'day' | 'night') => void; // Функция, вызываемая при переключении темы
}

// Интерфейс параметров масштабирования
interface ScalingParams {
    scaleX: number;
    scaleY: number;
    rotation: number;
    morphRadius?: number; // Для солнца
    morphFactor?: number; // Для шестиугольника
}

// Интерфейс состояния анимации
interface AnimationState {
    isDay: boolean;
    animationProgress: number;
    isAnimating: boolean;
    isForward: boolean;
    particles: ParticleClass[];
    animationFrameId?: number;
}

// Константы для Canvas
const CANVAS_WIDTH = 120;
const CANVAS_HEIGHT = 120;
const CENTER_X = CANVAS_WIDTH / 2;
const CENTER_Y = CANVAS_HEIGHT / 2;
const BASE_RADIUS = 24;
const RAY_COUNT = 12;
const RAY_LENGTH_FACTOR = 1.8;
const GLOW_RADIUS_FACTOR = 1.3;

// Класс частицы для эффекта искр при переходе
class ParticleClass { // Переименовываем класс, чтобы избежать слияния
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    life: number;

    constructor(x: number, y: number, isForward: boolean) {
        this.x = x;
        this.y = y;
        this.size = isForward ? Math.random() * 2 + 1 : Math.random() * 2.5 + 1.5;
        this.speedX = isForward ? Math.random() * 1.5 - 0.75 : Math.random() * 2 - 1;
        this.speedY = isForward ? Math.random() * 1.5 - 0.75 : Math.random() * 2 - 1;
        this.life = 1;
    }

    update(): void {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 0.025;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.life * 0.6})`;
        ctx.fill();
    }
}

// Получение начальной темы с учётом sessionStorage и системной темы
function getInitialTheme(): boolean {
    // Проверяем сохранённую тему в sessionStorage
    const savedTheme = sessionStorage.getItem('theme');
    if (savedTheme === 'day') return true;
    if (savedTheme === 'night') return false;

    // Если темы нет, проверяем системную тему
    if (typeof window !== 'undefined' && window.matchMedia) {
        return !window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // По умолчанию — дневная тема
    return true;
}

// Создание градиента для солнца
function createSunGradient(ctx: CanvasRenderingContext2D, scaledRadius: number): CanvasGradient {
    const gradient = ctx.createRadialGradient(CENTER_X, CENTER_Y, 0, CENTER_X, CENTER_Y, scaledRadius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(1, 'rgba(200, 200, 200, 0.9)');
    return gradient;
}

// Создание градиента для шестиугольника
function createHexagonGradient(ctx: CanvasRenderingContext2D, scaledRadius: number): CanvasGradient {
    const gradient = ctx.createRadialGradient(CENTER_X, CENTER_Y, 0, CENTER_X, CENTER_Y, scaledRadius);
    gradient.addColorStop(0, 'rgba(20, 20, 20, 1)');
    gradient.addColorStop(1, 'rgba(60, 60, 60, 0.9)');
    return gradient;
}

// Создание частиц для эффекта перехода
function createParticles(state: AnimationState, count: number, isForward: boolean) {
    for (let i = 0; i < count; i++) {
        state.particles.push(new ParticleClass(CENTER_X, CENTER_Y, isForward));
    }
}

// Отрисовка текстуры шума
function drawNoise(ctx: CanvasRenderingContext2D) {
    const imageData = ctx.createImageData(CANVAS_WIDTH, CANVAS_HEIGHT);
    for (let i = 0; i < imageData.data.length; i += 4) {
        const noise = Math.random() * 40;
        imageData.data[i] = noise;
        imageData.data[i + 1] = noise;
        imageData.data[i + 2] = noise;
        imageData.data[i + 3] = 8; // Низкая прозрачность для тонкого эффекта
    }
    ctx.putImageData(imageData, 0, 0);
}

// Отрисовка фона с градиентом
function drawBackground(ctx: CanvasRenderingContext2D, isDay: boolean) {
    const bgGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    if (isDay) {
        bgGradient.addColorStop(0, 'rgba(40, 40, 40, 1)');
        bgGradient.addColorStop(1, 'rgba(10, 10, 10, 1)');
    } else {
        bgGradient.addColorStop(0, 'rgba(5, 5, 5, 1)');
        bgGradient.addColorStop(1, 'rgba(30, 30, 30, 1)');
    }
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

// Вычисление масштабирования для солнца
function getSunScaling(progress: number, isForward: boolean): ScalingParams {
    if (isForward) {
        return {
            scaleX: 1,
            scaleY: 1,
            rotation: progress * Math.PI * 0.5, // Вращение для прямой анимации
            morphRadius: 1 - progress * 0.25 // Уменьшение радиуса
        };
    }
    return {
        scaleX: 1 - progress * 0.1, // Асимметричное сжатие
        scaleY: 1 + progress * 0.1,
        rotation: 0, // Без вращения для обратной
        morphRadius: 1 // Полный радиус
    };
}

// Вычисление масштабирования для шестиугольника
function getHexagonScaling(progress: number, isForward: boolean): ScalingParams {
    if (isForward) {
        return {
            scaleX: 1,
            scaleY: 1,
            rotation: (1 - progress) * Math.PI * 0.5, // Вращение
            morphFactor: progress * 0.25 // Расширение вершин
        };
    }
    return {
        scaleX: 1 + progress * 0.1, // Асимметричное сжатие
        scaleY: 1 - progress * 0.1,
        rotation: 0,
        morphFactor: (1 - progress) * 0.25 // Сужение вершин
    };
}

// Отрисовка круга солнца
function drawSunCircle(ctx: CanvasRenderingContext2D, scaledRadius: number, morphRadius: number, scaleX: number, scaleY: number, rotation: number, sunGradient: CanvasGradient | null) {
    if (!sunGradient) sunGradient = createSunGradient(ctx, scaledRadius);
    ctx.save();
    ctx.translate(CENTER_X, CENTER_Y);
    ctx.scale(scaleX, scaleY);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.arc(0, 0, scaledRadius * morphRadius, 0, Math.PI * 2);
    ctx.fillStyle = sunGradient;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.restore();
    return sunGradient;
}

// Отрисовка лучей солнца
function drawSunRays(ctx: CanvasRenderingContext2D, scaledRadius: number, progress: number, isForward: boolean, isDay: boolean, isAnimating: boolean) {
    ctx.save();
    // Лучи полностью видимы в дневном режиме или к концу обратной анимации
    ctx.globalAlpha = isDay && !isAnimating ? 1 : (isForward ? 1 - progress : progress);
    const rayLength = scaledRadius * RAY_LENGTH_FACTOR;
    for (let i = 0; i < RAY_COUNT; i++) {
        const angle = (i / RAY_COUNT) * Math.PI * 2;
        const pulse = Math.sin(Date.now() / 600 + i) * 0.08 + 0.92;
        const rayEndX = CENTER_X + Math.cos(angle) * rayLength * pulse;
        const rayEndY = CENTER_Y + Math.sin(angle) * rayLength * pulse;
        ctx.beginPath();
        ctx.moveTo(CENTER_X, CENTER_Y);
        ctx.lineTo(rayEndX, rayEndY);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    ctx.restore();
}

// Отрисовка свечения солнца
function drawSunGlow(ctx: CanvasRenderingContext2D, scaledRadius: number, progress: number, isForward: boolean) {
    ctx.save();
    ctx.globalAlpha = (isForward ? 1 - progress : progress) * 0.3;
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, scaledRadius * GLOW_RADIUS_FACTOR, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.restore();
}

// Отрисовка солнца
function drawSun(
  ctx: CanvasRenderingContext2D,
  progress: number,
  isForward: boolean,
  isDay: boolean,
  isAnimating: boolean,
  sunGradientRef: React.MutableRefObject<CanvasGradient | null> // Используем useRef
) {
  const breathe = Math.sin(Date.now() / 1000) * 0.04 + 1;
  const scaledRadius = BASE_RADIUS * breathe;
  const { scaleX, scaleY, rotation, morphRadius } = getSunScaling(progress, isForward);

  // Используем sunGradientRef.current вместо параметра
  sunGradientRef.current = drawSunCircle(
    ctx,
    scaledRadius,
    morphRadius!,
    scaleX,
    scaleY,
    rotation,
    sunGradientRef.current
  );
  drawSunRays(ctx, scaledRadius, progress, isForward, isDay, isAnimating);
  drawSunGlow(ctx, scaledRadius, progress, isForward);
  return sunGradientRef.current;
}

// Отрисовка шестиугольника
function drawHexagonShape(ctx: CanvasRenderingContext2D, scaledRadius: number, morphFactor: number, scaleX: number, scaleY: number, rotation: number, hexagonGradient: CanvasGradient | null) {
    if (!hexagonGradient) hexagonGradient = createHexagonGradient(ctx, scaledRadius);
    ctx.save();
    ctx.translate(CENTER_X, CENTER_Y);
    ctx.scale(scaleX, scaleY);
    ctx.rotate(rotation);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
        const vertexX = Math.cos(angle) * scaledRadius * (1 + morphFactor);
        const vertexY = Math.sin(angle) * scaledRadius * (1 + morphFactor);
        if (i === 0) ctx.moveTo(vertexX, vertexY);
        else ctx.lineTo(vertexX, vertexY);
    }
    ctx.closePath();
    ctx.fillStyle = hexagonGradient;
    ctx.fill();
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.8)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.restore();
    return hexagonGradient;
}

// Отрисовка звезды внутри шестиугольника
function drawStar(ctx: CanvasRenderingContext2D, scaledRadius: number, progress: number, isForward: boolean) {
    ctx.save();
    ctx.globalAlpha = isForward ? progress : 1 - progress;
    const starRadius = scaledRadius * 0.4;
    const twinkle = Math.sin(Date.now() / 400) * 0.08 + 0.92;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
        const starX = CENTER_X + Math.cos(angle) * starRadius * twinkle * (isForward ? 1 : 1 - progress * 0.5);
        const starY = CENTER_Y + Math.sin(angle) * starRadius * twinkle * (isForward ? 1 : 1 - progress * 0.5);
        if (i === 0) ctx.moveTo(starX, starY);
        else ctx.lineTo(starX, starY);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(220, 220, 220, 1)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 0.4;
    ctx.stroke();
    ctx.restore();
}

// Отрисовка свечения шестиугольника
function drawHexagonGlow(ctx: CanvasRenderingContext2D, scaledRadius: number, progress: number, isForward: boolean) {
    ctx.save();
    ctx.globalAlpha = (isForward ? progress : 1 - progress) * 0.3;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
        const vertexX = CENTER_X + Math.cos(angle) * scaledRadius * GLOW_RADIUS_FACTOR;
        const vertexY = CENTER_Y + Math.sin(angle) * scaledRadius * GLOW_RADIUS_FACTOR;
        if (i === 0) ctx.moveTo(vertexX, vertexY);
        else ctx.lineTo(vertexX, vertexY);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.restore();
}

// Отрисовка шестиугольника
function drawHexagon(
  ctx: CanvasRenderingContext2D,
  progress: number,
  isForward: boolean,
  hexagonGradientRef: React.MutableRefObject<CanvasGradient | null> // Используем useRef
) {
  const breathe = Math.sin(Date.now() / 1000) * 0.04 + 1;
  const scaledRadius = BASE_RADIUS * breathe;
  const { scaleX, scaleY, rotation, morphFactor } = getHexagonScaling(progress, isForward);

  // Используем hexagonGradientRef.current вместо параметра
  hexagonGradientRef.current = drawHexagonShape(
    ctx,
    scaledRadius,
    morphFactor!,
    scaleX,
    scaleY,
    rotation,
    hexagonGradientRef.current
  );
  drawStar(ctx, scaledRadius, progress, isForward);
  drawHexagonGlow(ctx, scaledRadius, progress, isForward);
  return hexagonGradientRef.current;
}

// Обновление состояния анимации
function updateAnimation(state: AnimationState): boolean {
    if (!state.isAnimating) return false;
    state.animationProgress += 0.025; // Шаг анимации
    if (state.animationProgress >= 1) {
        state.animationProgress = 1;
        state.isAnimating = false;
        state.isDay = !state.isDay;
        state.particles = [];
        // Сохранение темы в sessionStorage
        sessionStorage.setItem('theme', state.isDay ? 'day' : 'night');
        return false;
    }
    if (state.animationProgress > 0.3 && state.animationProgress < 0.7) {
        createParticles(state, state.isForward ? 2 : 3, state.isForward);
    }
    return true;
}

// Основной цикл анимации
function animate(
  ctx: CanvasRenderingContext2D,
  state: AnimationState,
  sunGradientRef: React.MutableRefObject<CanvasGradient | null>,
  hexagonGradientRef: React.MutableRefObject<CanvasGradient | null>
) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawBackground(ctx, state.isDay);
  drawNoise(ctx);

  state.particles = state.particles.filter((p) => p.life > 0);
  state.particles.forEach((p) => {
    p.update();
    p.draw(ctx);
  });

  const isAnimationActive = updateAnimation(state);

  if (state.isDay || isAnimationActive) {
    drawSun(
      ctx,
      state.isForward ? state.animationProgress : 1 - state.animationProgress,
      state.isForward,
      state.isDay,
      state.isAnimating,
      sunGradientRef
    );
  }
  if (!state.isDay || isAnimationActive) {
    drawHexagon(
      ctx,
      state.isForward ? state.animationProgress : 1 - state.animationProgress,
      state.isForward,
      hexagonGradientRef
    );
  }

  state.animationFrameId = requestAnimationFrame(() =>
    animate(ctx, state, sunGradientRef, hexagonGradientRef)
  );
}

// Обработчик клика для переключения темы
function handleClick(state: AnimationState, onToggle: (nextTheme: 'day' | 'night') => void) {
    if (state.isAnimating) return;
    state.isAnimating = true;
    state.animationProgress = 0;
    state.isForward = state.isDay;
    const nextTheme = state.isDay ? 'night' : 'day';
    onToggle(nextTheme);
    createParticles(state, state.isForward ? 8 : 12, state.isForward);
}

// Компонент переключателя тем
const ThemeToggle: React.FC<ThemeToggleProps> = ({ onToggle }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sunGradientRef = useRef<CanvasGradient | null>(null); // useRef для sunGradient
  const hexagonGradientRef = useRef<CanvasGradient | null>(null); // useRef для hexagonGradient

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = true;

    const state: AnimationState = {
      isDay: getInitialTheme(),
      animationProgress: 0,
      isAnimating: false,
      isForward: true,
      particles: [],
    };

    const clickHandler = () => handleClick(state, onToggle);
    canvas.addEventListener('click', clickHandler);

    animate(ctx, state, sunGradientRef, hexagonGradientRef); // Передаем useRef

    return () => {
      if (state.animationFrameId) {
        cancelAnimationFrame(state.animationFrameId);
      }
      canvas.removeEventListener('click', clickHandler);
    };
  }, [onToggle]);

  return <canvas ref={canvasRef} width={120} height={120} className={styles.canvas} />;
};

// Экспорт компонента с memo
export default memo(ThemeToggle);