'use client'
import { ReactNode, memo } from 'react'

interface Props {
  id: string
  classMain: string
  classOuter: string
  children: ReactNode
}

const SectionWrapper = ({id, classMain, classOuter, children}: Props) => {
  return (
    <div className={classOuter}>
      <section id={id} className={classMain}>
        {children}
      </section>
    </div>
  )
}
const MemoizedSectionWrapper = memo(SectionWrapper)

export default MemoizedSectionWrapper;