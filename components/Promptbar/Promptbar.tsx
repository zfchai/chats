import { useContext, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useCreateReducer } from '@/hooks/useCreateReducer';
import { Prompt } from '@/types/prompt';
import { Prompts } from './components/Prompts';

import Sidebar from '../Sidebar';
import PromptbarContext from './PromptBar.context';
import { PromptbarInitialState, initialState } from './Promptbar.state';

import { v4 as uuidv4 } from 'uuid';
import { HomeContext } from '@/pages/home/home';
import {
  deleteUserPrompts,
  postUserPrompts,
  putUserPrompts,
} from '@/apis/userService';
import toast from 'react-hot-toast';

const PromptBar = () => {
  const { t } = useTranslation('prompt');

  const promptBarContextValue = useCreateReducer<PromptbarInitialState>({
    initialState,
  });

  const {
    state: { prompts, showPromptbar },
    dispatch: homeDispatch,
    hasModel,
  } = useContext(HomeContext);

  const {
    state: { searchTerm, filteredPrompts },
    dispatch: promptDispatch,
  } = promptBarContextValue;

  const handleTogglePromptbar = () => {
    homeDispatch({ field: 'showPromptbar', value: !showPromptbar });
    localStorage.setItem('showPromptbar', JSON.stringify(!showPromptbar));
  };

  const handleCreatePrompt = () => {
    const newPrompt: Prompt = {
      id: uuidv4(),
      name: `Prompt ${prompts.length + 1}`,
      description: '',
      content: '',
    };

    postUserPrompts(newPrompt).then((data) => {
      const updatedPrompts = [...prompts, data];
      homeDispatch({ field: 'prompts', value: updatedPrompts });
      toast.success(t('Created successful!'));
    });
  };

  const handleDeletePrompt = (prompt: Prompt) => {
    deleteUserPrompts(prompt.id).then(() => {
      const updatedPrompts = prompts.filter((p) => p.id !== prompt.id);
      homeDispatch({ field: 'prompts', value: updatedPrompts });
      toast.success(t('Deleted successful!'));
    });
  };

  const handleUpdatePrompt = (prompt: Prompt) => {
    putUserPrompts(prompt).then(() => {
      const updatedPrompts = prompts.map((p) => {
        if (p.id === prompt.id) {
          return prompt;
        }
        return p;
      });
      homeDispatch({ field: 'prompts', value: updatedPrompts });
      toast.success(t('Updated successful!'));
    });
  };

  useEffect(() => {
    if (searchTerm) {
      promptDispatch({
        field: 'filteredPrompts',
        value: prompts.filter((prompt) => {
          const searchable =
            prompt.name.toLowerCase() +
            ' ' +
            prompt.description.toLowerCase() +
            ' ' +
            prompt.content.toLowerCase();
          return searchable.includes(searchTerm.toLowerCase());
        }),
      });
    } else {
      promptDispatch({ field: 'filteredPrompts', value: prompts });
    }
  }, [searchTerm, prompts]);

  return (
    <PromptbarContext.Provider
      value={{
        ...promptBarContextValue,
        handleCreatePrompt,
        handleDeletePrompt,
        handleUpdatePrompt,
      }}
    >
      <Sidebar<Prompt>
        hasModel={hasModel}
        side={'right'}
        showOpenButton={false}
        isOpen={showPromptbar}
        addItemButtonTitle={t('New prompt')}
        itemComponent={<Prompts prompts={filteredPrompts} />}
        items={filteredPrompts}
        searchTerm={searchTerm}
        handleSearchTerm={(searchTerm: string) =>
          promptDispatch({ field: 'searchTerm', value: searchTerm })
        }
        toggleOpen={handleTogglePromptbar}
        handleCreateItem={handleCreatePrompt}
      />
    </PromptbarContext.Provider>
  );
};

export default PromptBar;
