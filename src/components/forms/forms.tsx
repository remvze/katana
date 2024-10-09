import { useState } from 'react';

import { ShortenForm } from '../shorten-form';
import { DeleteUrl } from '../delete-url';
import { Container } from '../container';

import styles from './forms.module.css';
import { cn } from '@/helpers/styles';

export function Forms() {
  const [selectedTab, setSelectedTab] = useState<'create' | 'delete'>('create');

  return (
    <Container>
      <div className={styles.tabs}>
        <button
          className={cn(
            styles.tab,
            selectedTab === 'create' && styles.selected,
          )}
          onClick={() => setSelectedTab('create')}
        >
          Create URL
        </button>
        <button
          className={cn(
            styles.tab,
            selectedTab === 'delete' && styles.selected,
          )}
          onClick={() => setSelectedTab('delete')}
        >
          Delete URL
        </button>
      </div>

      {selectedTab === 'create' && <ShortenForm />}
      {selectedTab === 'delete' && <DeleteUrl />}
    </Container>
  );
}
