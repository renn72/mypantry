import React, { useState } from 'react';
import {
  ActionIcon,
  Button,
  ColorScheme,
  Loader,
  Skeleton,
} from '@mantine/core';
import {
  IconBrightnessDown,
  IconMoon,
  IconLogin,
  IconLayoutSidebarRightExpand,
} from '@tabler/icons';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
  colorScheme: ColorScheme;
  toggleColorScheme: (value?: ColorScheme) => void;
}

const Layout: React.FC<LayoutProps> = (props) => {
  const { children, colorScheme, toggleColorScheme } = props;
  const isDark = colorScheme === 'dark';

  const { data: session, status } = useSession();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    setLoggingOut(true);
    signOut().finally(() => setLoggingOut(false));
  };

  return (
    <div className="w-full h-full">
      <div className='flex items-center justify-between content-evenly my-2 mx-5'>
        <div className="top-4 left-8 cursor-pointer">
          <Link href="/">
            <h2 className="text-2xl font-extrabold">mypantry</h2>
          </Link>
        </div>
        <div className="top-4 right-4 flex gap-4">
          {session && session.user && (
            <span className="text-xl font-bold">{session.user.name}</span>
          )}
          <Skeleton visible={status === 'loading'}>
            {session ? (
              <Button
                className="!w-[112px]"
                color="teal"
                variant="light"
                rightIcon={loggingOut ? null : <IconLogin />}
                onClick={handleLogout}
              >
                {loggingOut ? <Loader
                  color="white"
                  size={20}
                /> : 'Logout'}
              </Button>
            ) : (
              <Button
                color="teal"
                variant="light"
                rightIcon={<IconLayoutSidebarRightExpand />}
                onClick={() => signIn()}
              >
              Login
              </Button>
            )}
          </Skeleton>
          <ActionIcon
            color="teal"
            variant="light"
            size="lg"
            onClick={() => toggleColorScheme()}
          >
            {isDark ? <IconBrightnessDown /> : <IconMoon />}
          </ActionIcon>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Layout;
