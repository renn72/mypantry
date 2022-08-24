import { useEffect, useState } from "react";
import Head from "next/head";
import { Button, Loader, Modal, Textarea, TextInput } from "@mantine/core";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import type { SubmitHandler } from "react-hook-form";
import type { NextPage } from "next";

import { useMutation, useContext } from "../../utils/trpc";

interface CreatePostForm {
  title: string;
  content: string;
  image: string;
}

const CreatePost: NextPage = () => {
  const { push } = useRouter();
  const { status } = useSession();

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      setModalOpen(true);
    }
  }, [status]);

  const handleModalClose = () => {
    push("/");
    setModalOpen(false);
  };

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<CreatePostForm>({ mode: "onChange" });
  const { invalidateQueries, cancelQuery, getQueryData, setQueryData } =
    useContext();
  const { mutate: createPost, isLoading } = useMutation("post.create", {
    onMutate: async ({ title }) => {
      await cancelQuery(["post.getAll"]);

      const previousPosts = getQueryData(["post.getAll"]);
      if (previousPosts) {
        setQueryData(
          ["post.getAll"],
          [...previousPosts, { id: "to-fetch", title }]
        );
      }
    },
    onSettled: () => {
      invalidateQueries(["post.getAll"]);
      push("/");
    },
    onError: (error) => {
      console.error("error", error);
    },
  });

  const onSubmit: SubmitHandler<CreatePostForm> = (data) => {
    const { title, content } = data;

    createPost({
      title,
      content,
      // TODO: Add logic to upload image
      image: "",
    });
  };

  return (
    <>
      <Head>
        <title>T3 Blog - Create a new Post</title>
      </Head>

      <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-5xl md:text-[4rem] leading-normal font-extrabold text-amber-300">
          Create a new Post
        </h2>
        <form
          className="flex flex-col items-center justify-center w-3/5 gap-4 my-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            name="title"
            defaultValue=""
            control={control}
            rules={{ required: "Title is required!" }}
            render={({ field }) => (
              <TextInput
                className="w-full"
                label="Title"
                placeholder="Title for your post"
                name={field.name}
                value={field.value}
                ref={field.ref}
                onChange={field.onChange}
                onBlur={field.onBlur}
                required
              />
            )}
          />
          <Controller
            name="content"
            defaultValue=""
            control={control}
            rules={{ required: "Content is required!" }}
            render={({ field }) => (
              <Textarea
                className="w-full"
                label="Post Content"
                placeholder="Your post content goes here"
                minRows={2}
                name={field.name}
                value={field.value}
                ref={field.ref}
                onChange={field.onChange}
                onBlur={field.onBlur}
                required
                autosize
              />
            )}
          />
          <div>
            <Button
              type="submit"
              size="lg"
              variant="gradient"
              gradient={{ from: "teal", to: "lime", deg: 105 }}
              disabled={!isValid || isLoading}
            >
              {isLoading ? <Loader color="white" /> : "Submit"}
            </Button>
          </div>
        </form>
      </main>
      <Modal
        opened={modalOpen}
        onClose={handleModalClose}
        title="Secured Page"
        transition="fade"
        transitionDuration={600}
        transitionTimingFunction="ease"
        overlayOpacity={0.55}
        overlayBlur={3}
        centered
      >
        <div className="flex flex-col gap-4">
          Hi, please login to create a post.
          <Button variant="light" onClick={() => push("/api/auth/signin")}>
            Click here to login
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default CreatePost;
