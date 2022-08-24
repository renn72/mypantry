import Head from "next/head";
import { useRouter } from "next/router";
import { Button, Loader } from "@mantine/core";
import { IconArrowNarrowLeft } from "@tabler/icons";
import type { NextPage } from "next";

import { useQuery } from "../../utils/trpc";
import { useSession } from "next-auth/react";

const Posts: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data: post } = useQuery(["post.getById", { id }]);
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>T3 Blog - {post?.title || "Post"}</title>
      </Head>

      <main className="container mx-auto flex items-center justify-center min-h-screen p-4">
        {post ? (
          <div className="flex flex-col items-center justify-center gap-6">
            <h2 className="text-5xl md:text-[4rem] leading-normal font-extrabold text-amber-300">
              {post.title}
            </h2>
            <div className="w-full flex items-center justify-between gap-20">
              <span className="text-2xl md:text-[2rem] leading-normal font-bold text-green-300">
                Created by: {post.author}
              </span>
              <span className="text-xl md:text-[1.5rem] leading-normal font-bold text-blue-300">
                Created on: {post.createdAt.toDateString()}
              </span>
            </div>
            <div className="my-4 text-lg text-gray-300">{post.userId}</div>
            <div className="my-4 text-lg text-gray-300">{session?.user?.id}</div>
            <div className="my-4 text-lg text-gray-300">{post.content}</div>
            <Button
              component="a"
              size="lg"
              leftIcon={<IconArrowNarrowLeft />}
              variant="light"
              onClick={() => router.back()}
            >
              Go back
            </Button>
          </div>
        ) : (
          <Loader variant="bars" />
        )}
      </main>
    </>
  );
};

export default Posts;
