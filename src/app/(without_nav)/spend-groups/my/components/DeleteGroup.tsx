'use client';
import { Button } from '@heroui/button';
import { Modal, ModalContent, ModalBody, ModalFooter } from '@heroui/modal';
import { useDisclosure } from '@heroui/use-disclosure';
import { useRouter } from 'next/navigation';

export default function DeleteGroup({ groupId }: { groupId: string }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();

  const onDeleteGroup = async () => {
    //navigate to group list page
    router.back();
  };

  return (
    <>
      <Button color='danger' variant='bordered' onPress={onOpen}>
        Delete Group
      </Button>
      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <h1>Are you sure you want to delete this group?</h1>
              </ModalBody>
              <ModalFooter className='flex gap-4'>
                <Button
                  color='primary'
                  onPress={() => {
                    onClose();
                    onDeleteGroup(); // Wait for deletion after modal is closed
                  }}
                >
                  Delete
                </Button>
                <Button color='danger' variant='bordered' onPress={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
