import React, { useEffect, useRef } from 'react';

import { checkFileSizeCanUpload, uploadFile } from '@/utils/uploadFile';
import { ChatModelFileConfig } from '@/types/model';
import { ImageDef } from '@/types/chat';

interface IPasteUploadProps {
  fileServiceId: number;
  fileConfig: ChatModelFileConfig;
  onUploading?: () => void;
  onSuccessful?: (def: ImageDef) => void;
  onFailed?: (reason: string | null) => void;
}

const PasteUpload = (props: IPasteUploadProps) => {
  const { fileServiceId, fileConfig, onUploading, onSuccessful, onFailed } =
    props;
  const uploadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (items) {
        const itemsArray = Array.from(items);
        for (const item of itemsArray) {
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) {
              handleFileUpload(file);
            }
          }
        }
      }
    };

    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, []);

  const handleFileUpload = (file: File) => {
    const { maxSize } = fileConfig || { maxSize: 0 };
    if (checkFileSizeCanUpload(maxSize, file.size)) {
      onFailed && onFailed('File is too large.');
      return;
    }
    uploadFile(file, fileServiceId, onUploading, onSuccessful, onFailed);
  };

  return <div ref={uploadRef} hidden></div>;
};

export default PasteUpload;
