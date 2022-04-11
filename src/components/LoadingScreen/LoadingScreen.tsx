import { FC, useEffect, useState } from 'react';
import style from './LoadingScreen.module.css';
import { ReactComponent as Logo } from 'assets/logo.svg';

interface Props {
  loading: boolean;
}

const LoadingScreen: FC<Props> = ({ loading }) => {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    if (!loading)
      setTimeout(() => {
        setShowLoading(false);
      }, 499);
  }, [loading]);

  return (
    <>
      {!!showLoading && (
        <div className={style.loading} style={{ opacity: loading ? '1' : '0' }}>
          <div className="flex justify-center items-center flex-col">
            <Logo />
            Loading...
          </div>
        </div>
      )}
    </>
  );
};

export default LoadingScreen;
