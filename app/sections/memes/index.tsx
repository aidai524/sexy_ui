'use client';

import Carousel from '@/app/sections/memes/components/carousel';
import MemesTabs from '@/app/sections/memes/components/tabs';
import { MemesContext } from '@/app/sections/memes/context';
import { useMemes } from '@/app/sections/memes/hooks';
import styles from './index.module.css';
import PageHeader from '@/app/components/page-header/mobile';
import { useUserAgent } from '@/app/context/user-agent';

const MemesView = (props: any) => {
  const {} = props;

  const { isMobile } = useUserAgent();

  const data = useMemes({ isLoadData: true });

  return (
    <MemesContext.Provider value={{ ...data }}>
      <div className={styles.MemesContainer}>
        {
          isMobile && (
            <PageHeader
              from="memes"
              style={{ position: "static" }}
              title=""
            />
          )
        }
        <Carousel data={data.hotList?.slice?.(0, 3) || []} />
        <MemesTabs />
      </div>
    </MemesContext.Provider>
  );
};

export default MemesView;
