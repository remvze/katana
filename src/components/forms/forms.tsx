import { useState } from 'react';

import { ShortenForm } from '../shorten-form';
import { DeleteUrl } from '../delete-url';
import { Container } from '../container';

import styles from './forms.module.css';
import { cn } from '@/helpers/styles';

export function Forms() {
  const [selectedTab, setSelectedTab] = useState<'shorten' | 'delete'>(
    'shorten',
  );

  return (
    <Container>
      <div className={styles.tabs}>
        <button
          className={cn(
            styles.tab,
            selectedTab === 'shorten' && styles.selected,
          )}
          onClick={() => setSelectedTab('shorten')}
        >
          Shorten URL
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
        <a className={styles.tab} href="/secret">
          Share Secret
        </a>
      </div>

      {selectedTab === 'shorten' && <ShortenForm />}
      {selectedTab === 'delete' && <DeleteUrl />}
    </Container>
  );
}
