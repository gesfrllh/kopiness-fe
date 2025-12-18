import { ReactElement, ReactNode } from "react";
import { UUIDTypes } from 'uuid'

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
export interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
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

export interface Option {
  label: string;
  value: string;
}

export interface SelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  required?: boolean;
  disabled?: boolean;
}

export type Column<T> = {
  header: string,
  key: keyof T,
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