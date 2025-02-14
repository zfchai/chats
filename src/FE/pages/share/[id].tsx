import { useEffect, useState } from 'react';

import Link from 'next/link';
import { NextRouter, useRouter } from 'next/router';

import useTranslation from '@/hooks/useTranslation';

import { getSelectMessages } from '@/utils/message';

import { GetMessageDetailsResult } from '@/types/adminApis';
import { ChatMessage } from '@/types/chatMessage';

import { ChatMessage as ChatMessageComponent } from '@/components/Admin/Messages/ChatMessage';
import PageNotFound from '@/components/PageNotFound/PageNotFound';
import { Button } from '@/components/ui/button';

import { getShareMessage } from '@/apis/adminApis';
import Decimal from 'decimal.js';
import { getQueryId } from '@/utils/common';

export default function ShareMessage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [chat, setChat] = useState<GetMessageDetailsResult | null>(null);
  const [selectMessages, setSelectMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([]);



  useEffect(() => {
    setLoading(true);
    if (!router.isReady) return;
    const messageId = getQueryId(router)!;
    getShareMessage(messageId)
      .then((data) => {
        document.title = data.name;
        if (data.messages.length > 0) {
          setChat(data);
          setCurrentMessages(data.messages);
          const lastMessage = data.messages[data.messages.length - 1];
          const _selectMessages = getSelectMessages(
            data.messages,
            lastMessage.id,
          );
          setSelectMessages(_selectMessages);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router.isReady]);

  const onMessageChange = (messageId: string) => {
    const _selectMessages = getSelectMessages(currentMessages, messageId);
    setSelectMessages(_selectMessages);
  };

  const showChat = () => {
    return chat ? (
      <>
        <div className="w-full">
          {chat &&
            selectMessages.map((current, index) => {
              let parentChildrenIds: string[] = [];
              if (!current.parentId) {
                parentChildrenIds = currentMessages
                  .filter((x) => !x.parentId)
                  .map((x) => x.id);
              } else {
                parentChildrenIds =
                  currentMessages.find((x) => x.id === current.parentId)
                    ?.childrenIds || [];
                parentChildrenIds = [...parentChildrenIds].reverse();
              }
              return (
                <ChatMessageComponent
                  currentSelectIndex={parentChildrenIds.findIndex(
                    (x) => x === current.id,
                  )}
                  isLastMessage={selectMessages.length - 1 === index}
                  id={current.id!}
                  key={current.id + index}
                  parentId={current.parentId}
                  onChangeMessage={(messageId: string) => {
                    onMessageChange(messageId);
                  }}
                  childrenIds={current.childrenIds}
                  parentChildrenIds={parentChildrenIds}
                  assistantChildrenIds={current.assistantChildrenIds}
                  assistantCurrentSelectIndex={current.assistantChildrenIds.findIndex(
                    (x) => x === current.id,
                  )}
                  modelName={current.modelName}
                  message={{
                    id: current.id!,
                    role: current.role,
                    content: current.content,
                    duration: current.duration || 0,
                    firstTokenLatency: current.firstTokenLatency || 0,
                    inputTokens: current.inputTokens || 0,
                    outputTokens: current.outputTokens || 0,
                    reasoningTokens: current.reasoningTokens || 0,
                    inputPrice: new Decimal(current.inputPrice || 0),
                    outputPrice: new Decimal(current.outputPrice || 0),
                  }}
                />
              );
            })}
        </div>
        <div className="h-32"></div>
        <div className="fixed bottom-0 py-4 w-full bg-white dark:bg-black dark:text-white">
          <div className="flex justify-center pb-2">
            <Link href="/">
              <Button className="h-8 w-32">{t('Using Chats')}</Button>
            </Link>
          </div>
          <div className="flex justify-center text-gray-500 text-sm">
            {t(
              'The content is generated by AI big model, please screen carefully',
            )}
          </div>
        </div>
      </>
    ) : (
      <PageNotFound />
    );
  };

  return loading ? <></> : showChat();
}
