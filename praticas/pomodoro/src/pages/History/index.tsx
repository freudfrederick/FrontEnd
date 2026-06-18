import { TrashIcon } from 'lucide-react';
import { Container } from '../../components/Container';
import { DefaultButton } from '../../components/DefaultButton';
import { Heading } from '../../components/Heading';
import { MainTemplate } from '../../templates/MainTemplate';
import styles from './styles.module.css';
import { formatDate } from '../../utils/formatDate';
import { sortTasks, type SortTasksOptions } from '../../utils/sortTasks';
import { useEffect, useState } from 'react';
import { showMessage } from '../../adapters/showMessage';
import { getTasks, clearTasks, type ApiTask } from '../../services/apiService';

export function History() {
  const [tasks, setTasks] = useState<ApiTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [sortTasksOptions, setSortTaskOptions] = useState<SortTasksOptions>({
    tasks: [],
    field: 'startDate',
    direction: 'desc',
  });

  useEffect(() => {
    document.title = 'Histórico - Chronos Pomodoro';
  }, []);

  useEffect(() => {
    async function loadTasks() {
      setIsLoading(true);
      try {
        const data = await getTasks();
        setTasks(data);
        setSortTaskOptions(prev => ({
          ...prev,
          tasks: sortTasks({ tasks: data as any, direction: prev.direction, field: prev.field }),
        }));
      } catch {
        showMessage.error('Erro ao carregar histórico. Verifique a API.');
      } finally {
        setIsLoading(false);
      }
    }
    loadTasks();
  }, []);

  useEffect(() => {
    return () => { showMessage.dismiss(); };
  }, []);

  function handleSortTasks({ field }: Pick<SortTasksOptions, 'field'>) {
    const newDirection = sortTasksOptions.direction === 'desc' ? 'asc' : 'desc';
    setSortTaskOptions({
      tasks: sortTasks({ direction: newDirection, tasks: sortTasksOptions.tasks, field }),
      direction: newDirection,
      field,
    });
  }

  function handleResetHistory() {
    showMessage.dismiss();
    showMessage.confirm('Tem certeza?', async confirmation => {
      if (!confirmation) return;
      try {
        await clearTasks();
        setTasks([]);
        setSortTaskOptions(prev => ({ ...prev, tasks: [] }));
        showMessage.success('Histórico limpo!');
      } catch {
        showMessage.error('Erro ao limpar histórico. Verifique a API.');
      }
    });
  }

  const hasTasks = tasks.length > 0;

  function getTaskStatus(task: ApiTask) {
    if (task.completeDate) return '✅ Concluída';
    if (task.interruptDate) return '⛔ Interrompida';
    return '⏳ Em andamento';
  }

  const taskTypeDictionary: Record<string, string> = {
    workTime: 'Foco',
    shortBreakTime: 'Descanso curto',
    longBreakTime: 'Descanso longo',
  };

  return (
    <MainTemplate>
      <Container>
        <Heading>
          <span>History</span>
          {hasTasks && (
            <span className={styles.buttonContainer}>
              <DefaultButton
                icon={<TrashIcon />}
                color='red'
                aria-label='Apagar todo o histórico'
                title='Apagar histórico'
                onClick={handleResetHistory}
              />
            </span>
          )}
        </Heading>
      </Container>

      <Container>
        {isLoading && <p style={{ textAlign: 'center' }}>Carregando histórico...</p>}

        {!isLoading && hasTasks && (
          <div className={styles.responsiveTable}>
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSortTasks({ field: 'name' })} className={styles.thSort}>Tarefa ↕</th>
                  <th onClick={() => handleSortTasks({ field: 'duration' })} className={styles.thSort}>Duração ↕</th>
                  <th onClick={() => handleSortTasks({ field: 'startDate' })} className={styles.thSort}>Data ↕</th>
                  <th>Status</th>
                  <th>Tipo</th>
                </tr>
              </thead>
              <tbody>
                {sortTasksOptions.tasks.map((task: any) => (
                  <tr key={task.id}>
                    <td>{task.name}</td>
                    <td>{task.duration}min</td>
                    <td>{formatDate(Number(task.startDate))}</td>
                    <td>{getTaskStatus(task)}</td>
                    <td>{taskTypeDictionary[task.type] ?? task.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && !hasTasks && (
          <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
            Ainda não existem tarefas criadas.
          </p>
        )}
      </Container>
    </MainTemplate>
  );
}
