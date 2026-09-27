import { App, ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import type { ReactNode } from 'react';

export const AntdConfigProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ConfigProvider
      locale={ruRU}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
};