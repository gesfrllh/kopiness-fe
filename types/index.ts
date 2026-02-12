import { ReactElement, ReactNode } from "react";
import { UUIDTypes } from 'uuid'

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
export interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  checked?: boolean;
}

export interface Group {
  label: string;
  required?: boolean;
  children: ReactElement<BaseInputProps | TextareaProps>;
  value?: string
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline';
}

export interface BadgeInterface {
  text: number,
  color: 'green' | 'red' | 'blue' | 'yellow' | 'gray'
}

export interface CardProps {
  id: number,
  title: string,
  sec_title: string,
  desc: string,
  image: string,
  width: number,
  height: number,
  price: number,
  onAddToCart?: () => void,
  onDetail: (id: number) => void
}

export interface NavbarProps {
  link: string,
  title: string,
  id: UUIDTypes,
  icon?: ReactNode
}

export interface SelectOptions {
  label: string;
  value: string;
}

export interface SelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOptions[];
  required?: boolean;
  disabled?: boolean;
}

export interface Column<T> {
  id: string
  header: string
  accessor?: keyof T
  render?: (value: unknown, row: T) => React.ReactNode
}

export type TableProps<T> = {
  columns: Column<T>[],
  data: T[]
}

export type ModalSize = "sm" | "md" | "lg" | "xl"

export interface ModalProps {
  open: boolean,
  onClose: () => void;
  title?: string,
  description?: string,
  size?: ModalSize,
  closeOnOverlayClick?: boolean
  closeOnEsc?: boolean
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export interface ModalSelectionProps {
  children: ReactNode
}

export interface ModalConfirm extends Pick<ModalProps, 'open' | 'onClose' | 'title' | 'description'> {
  data?: null | string
  onConfirm: () => void,
  confirmText: string,
  cancelText: string,
}

export interface TextLabel {
  dot: boolean,
  title: string,
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
  // classNames?: string,
  // wieght: 'font-thin' | 'font-extralight  ' | 'font-light' | 'font-normal' | 'font-medium' | 'font-semibold' | 'font-bold' | 'font-extrabold'
}

export type AccordionItem = {
  id: string
  name?: string
  title?: React.ReactNode
  desc?: string,
  content: React.ReactNode
  subTotal: number
}

type BasePropsAccordion = {
  items: AccordionItem[]
  multiple?: boolean
  title?: string,
}

/* 🔹 SINGLE SELECT */
type SingleSelectProps = {
  selectable: 'single'
  value: AccordionItem | null
  onChange: (value: AccordionItem | null) => void
  deleteValue?: AccordionItem | null
  onClick: (value: AccordionItem | null) => void
}

/* 🔹 MULTI SELECT */
type MultiSelectProps = {
  selectable: 'multiple'
  value: AccordionItem[]
  onChange: (value: AccordionItem[]) => void
  deleteValue?: AccordionItem | null
  onClick: (value: AccordionItem | null) => void
}

/* 🔹 NON SELECTABLE */
type NoSelectProps = {
  selectable?: false
}

export type AccordionProps =
  | (BasePropsAccordion & SingleSelectProps)
  | (BasePropsAccordion & MultiSelectProps)
  | (BasePropsAccordion & NoSelectProps)
