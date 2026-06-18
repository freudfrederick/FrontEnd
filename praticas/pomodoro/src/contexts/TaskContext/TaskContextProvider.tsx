import { useEffect, useReducer, useRef } from 'react';
import { initialTaskState } from './initialTaskState';
import { taskReducer } from './taskReducer';
import { TaskContext } from './TaskContext';
import { TimerWorkerManager } from '../../workers/TimerWorkerManager';
import { TaskActionTypes } from './taskActions';
import { loadBeep } from '../../utils/loadBeep';
import type { TaskStateModel } from '../../models/TaskStateModel';
import { getSettings, completeTask } from '../../services/apiService';

type TaskContextProviderProps = {
  children: React.ReactNode;
};

export function TaskContextProvider({ children }: TaskContextProviderProps) {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState, () => {
    const storageState = localStorage.getItem('state');
    if (storageState === null) return initialTaskState;
    const parsedStorageState = JSON.parse(storageState) as TaskStateModel;
    return {
      ...parsedStorageState,
      activeTask: null,
      secondsRemaining: 0,
      formattedSecondsRemaining: '00:00',
    };
  });

  const playBeepRef = useRef<ReturnType<typeof loadBeep> | null>(null);
  const activeTaskRef = useRef(state.activeTask);
  const worker = TimerWorkerManager.getInstance();

  // Mantém ref atualizada com a activeTask
  useEffect(() => {
    activeTaskRef.current = state.activeTask;
  }, [state.activeTask]);

  // Carrega settings da API no startup
  useEffect(() => {
    getSettings()
      .then(apiSettings => {
        dispatch({
          type: TaskActionTypes.CHANGE_SETTINGS,
          payload: {
            workTime: apiSettings.workTime,
            shortBreakTime: apiSettings.shortBreakTime,
            longBreakTime: apiSettings.longBreakTime,
          },
        });
      })
      .catch(() => {
        console.warn('API indisponível, usando configurações locais.');
      });
  }, []);

  useEffect(() => {
    worker.onmessage(e => {
      const countDownSeconds = e.data;
      if (countDownSeconds <= 0) {
        if (playBeepRef.current) {
          playBeepRef.current();
          playBeepRef.current = null;
        }

        // Marca task como completa na API
        if (activeTaskRef.current) {
          completeTask(activeTaskRef.current.id).catch(() => {
            console.warn('API indisponível, conclusão salva apenas localmente.');
          });
        }

        dispatch({ type: TaskActionTypes.COMPLETE_TASK });
        worker.terminate();
      } else {
        dispatch({
          type: TaskActionTypes.COUNT_DOWN,
          payload: { secondsRemaining: countDownSeconds },
        });
      }
    });
  }, [worker]);

  useEffect(() => {
    localStorage.setItem('state', JSON.stringify(state));
    if (!state.activeTask) {
      worker.terminate();
    }
    document.title = `${state.formattedSecondsRemaining} - Chronos Pomodoro`;
    worker.postMessage(state);
  }, [worker, state]);

  useEffect(() => {
    if (state.activeTask && playBeepRef.current === null) {
      playBeepRef.current = loadBeep();
    } else {
      playBeepRef.current = null;
    }
  }, [state.activeTask]);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}
