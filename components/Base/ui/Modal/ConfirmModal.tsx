import { ModalConfirm } from "@/types"
import { Modal } from "./Modal"
import { ModalBody, ModalFooter, ModalHeader } from "./ModalCompunds"
import Button from "../../Button"

export const ConfirmModal: React.FC<ModalConfirm> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  data = 'testing',
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) => {
  return (
    <Modal open={open} onClose={onClose} size="md">
      <ModalHeader>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm text-gray-500">
          {description}
        </p>
      </ModalHeader>

      <ModalBody>
        <p className="text-xl font-semibold">{data}</p>
      </ModalBody>

      <ModalFooter>
        <Button onClick={onClose} variant='outline' >{cancelText}</Button>
        <button onClick={onConfirm} className="bg-red-600 cursor-pointer text-white px-4 py-2 rounded">
          {confirmText}
        </button>
      </ModalFooter>

    </Modal>
  )
}