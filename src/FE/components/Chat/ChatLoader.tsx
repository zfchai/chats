import { FC } from 'react';

import { IconRobot } from '@/components/Icons/index';

interface Props {}

export const ChatLoader: FC<Props> = () => {
  return (
    <div
      className="group text-gray-800 dark:text-gray-100"
      style={{ overflowWrap: 'anywhere' }}
    >
      <div className="m-auto flex gap-4 p-4 text-base md:max-w-2xl md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
        <div className="min-w-[40px] items-end">
          <IconRobot size={30} />
        </div>
        <span className="animate-pulse cursor-default mt-1">▍</span>
      </div>
    </div>
  );
};
