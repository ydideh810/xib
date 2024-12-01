import React, { useState, useEffect } from 'react';
import { ContactList } from './ContactList';
import { MessageThread } from './MessageThread';
import { MessageComposer } from './MessageComposer';
import { AddContactModal } from './AddContactModal';
import { PublicKeyDisplay } from './PublicKeyDisplay';
import { Contact, Message } from '../../types/message';
import { createMessage } from '../../utils/messageUtils';
import { useContacts } from '../../hooks/useContacts';
import { useP2PMessaging } from '../../hooks/useP2PMessaging';
import { convertFileToBase64, validateMediaFile } from '../../utils/mediaUtils';
import { UserPlus } from 'lucide-react';

export function MessagingInterface() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showAddContact, setShowAddContact] = useState(false);
  const { contacts, loadContacts, saveContact, deleteContact } = useContacts();
  const { keyPair, messages, sendMessage, sendMediaMessage } = useP2PMessaging();

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const handleSendMessage = async (content: string) => {
    if (selectedContact && keyPair) {
      const sent = await sendMessage(content, selectedContact.publicKey);
      if (sent) {
        console.log('Message sent:', sent);
      }
    }
  };

  const handleSendMedia = async (file: File, type: 'image' | 'video') => {
    if (!selectedContact || !keyPair) return;

    try {
      validateMediaFile(file, type);
      const base64Data = await convertFileToBase64(file);
      const sent = await sendMediaMessage(base64Data, type, selectedContact.publicKey);
      if (sent) {
        console.log('Media sent:', sent);
      }
    } catch (error) {
      console.error('Failed to send media:', error);
      alert(error instanceof Error ? error.message : 'Failed to send media');
    }
  };

  const handleSendVoiceNote = async (audioBlob: Blob) => {
    if (!selectedContact || !keyPair) return;

    try {
      const base64Data = await convertFileToBase64(new File([audioBlob], 'voice-note.webm'));
      const sent = await sendMediaMessage(base64Data, 'voice', selectedContact.publicKey);
      if (sent) {
        console.log('Voice note sent:', sent);
      }
    } catch (error) {
      console.error('Failed to send voice note:', error);
      alert('Failed to send voice note');
    }
  };

  const handleAddContact = async (contactData: { name: string; publicKey: string; avatar?: string }) => {
    try {
      await saveContact(contactData);
      setShowAddContact(false);
    } catch (error) {
      console.error('Failed to add contact:', error);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      await deleteContact(contactId);
      if (selectedContact?.id === contactId) {
        setSelectedContact(null);
      }
    } catch (error) {
      console.error('Failed to delete contact:', error);
    }
  };

  const filteredMessages = messages.filter(
    msg =>
      (msg.senderId === keyPair?.publicKey && msg.receiverId === selectedContact?.publicKey) ||
      (msg.receiverId === keyPair?.publicKey && msg.senderId === selectedContact?.publicKey)
  );

  return (
    <div className="h-full flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-64">
        <div className="mb-4 space-y-4">
          {keyPair && (
            <PublicKeyDisplay publicKey={keyPair.publicKey} />
          )}
          <div className="pb-2 border-b border-[#00ff9d] flex justify-between items-center">
            <h2 className="terminal-text text-[10px] md:text-xs">CONTACTS</h2>
            <button
              onClick={() => setShowAddContact(true)}
              className="terminal-button p-1"
              aria-label="Add contact"
            >
              <UserPlus className="h-3 w-3 md:h-4 md:w-4" />
            </button>
          </div>
        </div>
        <ContactList
          contacts={contacts}
          onSelectContact={setSelectedContact}
          onDeleteContact={handleDeleteContact}
          selectedContactId={selectedContact?.id}
        />
      </div>
      
      <div className="flex-1">
        {selectedContact ? (
          <>
            <div className="mb-4 pb-2 border-b border-[#00ff9d]">
              <h2 className="terminal-text text-[10px] md:text-xs">
                CHAT WITH {selectedContact.name.toUpperCase()}
              </h2>
            </div>
            <MessageThread
              messages={filteredMessages}
              currentUserId={keyPair?.publicKey || ''}
            />
            <div className="mt-4">
              <MessageComposer
                onSendMessage={handleSendMessage}
                onSendMedia={handleSendMedia}
                onSendVoiceNote={handleSendVoiceNote}
                recipientName={selectedContact.name}
              />
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="terminal-text text-[10px] md:text-xs text-[#00ff9d]/70">
              Select a contact to start messaging
            </p>
          </div>
        )}
      </div>

      {showAddContact && (
        <AddContactModal
          onClose={() => setShowAddContact(false)}
          onSave={handleAddContact}
        />
      )}
    </div>
  );
}