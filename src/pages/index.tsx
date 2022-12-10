import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { SiTwitter } from "react-icons/si";
import {
  RiHome8Fill,
  RiNotification2Line,
  RiMailLine,
  RiBookmarkLine,
  RiFileListLine,
  RiUserLine,
  RiHeart3Line,
  RiChat1Line,
  RiMoreLine,
  RiSearch2Line,
  RiQuillPenLine,
  RiLogoutBoxLine,
} from "react-icons/ri";
import { RxUpload } from "react-icons/rx";
import { BiHash } from "react-icons/bi";
import { CgMoreO } from "react-icons/cg";
import { HiOutlineSparkles } from "react-icons/hi";
import { AiOutlineRetweet } from "react-icons/ai";
import { trpc } from "../utils/trpc";
import type { Session } from "next-auth";
import { useState } from "react";
import { Tweet } from "@prisma/client";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const Home: NextPage = () => {
  const { data: sessionData, status } = useSession();

  if (status === "loading") return <div>Loading..</div>;

  if (status === "unauthenticated") {
    return (
      <div className="flex h-screen w-screen items-center justify-center  text-white">
        <button onClick={() => signIn()} className="border-2 p-4">
          Sign In To Use
        </button>
      </div>
    );
  }
  return (
    <>
      <Head>
        <title>Twitter Clone</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto h-screen w-11/12 sm:hidden">
        <MobileFeed />
      </main>
      <main className="mx-auto border hidden h-screen w-11/12 sm:grid sm:grid-cols-[20%_80%] lg:grid-cols-[10%_60%_30%] xl:grid-cols-[10%_70%_20%] 2xl:w-10/12 2xl:grid-cols-[35%_40%_20%]">
        <LeftSideNavigation sessionData={sessionData as Session} />
        <TweetFeed sessionData={sessionData as Session} />
        <RightSide />
      </main>
    </>
  );
};

const MobileFeed = () => {
  const tweets = trpc.example.getAll.useQuery();

  return (
    <section>
      <div className="top-0 flex w-full justify-between bg-black bg-opacity-75 py-4 pl-4 text-xl text-white backdrop-blur-xl">
        <button className="flex rounded-full border-slate-700 pr-4 pb-4 hover:bg-zinc-900">
          <Image
            src="https://randomuser.me/api/portraits/lego/8.jpg"
            alt="User Image"
            width={30}
            height={30}
            className="mr-4 rounded-full"
          />
          <span>Home</span>
        </button>
        <HiOutlineSparkles className="mr-4 h-6 w-6" />
      </div>
      <div>
        {tweets.data && (
          <>
            {tweets.data.map((tweet, index) => (
              <Tweet key={index} tweetInfo={tweet} />
            ))}
          </>
        )}
      </div>
      <div className="sticky bottom-0 w-full">
        <LeftSideMobile />
      </div>
    </section>
  );
};

const LeftSideMobile = () => {
  return (
    <section className="flex w-full items-center justify-evenly bg-black  text-xl text-white">
      <Link
        href="/"
        className="rounded-full border-slate-400 py-2 text-xl hover:bg-zinc-800"
      >
        <button className="">
          <RiHome8Fill className="inline-block h-6 w-6" />
        </button>
      </Link>

      <Link
        href="/"
        className="rounded-full border-slate-400 py-2 text-xl hover:bg-zinc-800"
      >
        <button>
          <RiSearch2Line className="inline-block h-6 w-6" />
        </button>
      </Link>
      <Link
        href="/"
        className="rounded-full border-slate-400 py-2   text-xl hover:bg-zinc-900"
      >
        <button>
          <RiNotification2Line className="inline-block h-6 w-6" />
        </button>
      </Link>
      <Link
        href="/"
        className="rounded-full border-slate-400 py-2 text-xl hover:bg-zinc-900"
      >
        <button>
          <RiMailLine className="inline-block h-6 w-6" />
        </button>
      </Link>
      <button className=" mx-2 mr-8 mt-6 hidden rounded-full bg-sky-500 py-3 text-xl hover:bg-sky-600">
        Tweet
      </button>
    </section>
  );
};

const TweetFeed = ({ sessionData }: { sessionData: Session }) => {
  const createTweet = trpc.example.hello.useMutation({
    onSuccess: () => tweets.refetch(),
  });

  const tweets = trpc.example.getAll.useQuery();

  const [tweetText, setTweetText] = useState("");
  const [tweetLength, setTweetLength] = useState(0);
  const [parent, enableAnimations] =
    useAutoAnimate<HTMLDivElement>(/* optional config */);

  return (
    <section>
      <>
        <div className="flex flex-col  items-center justify-between bg-black bg-opacity-75 py-4 pl-4 text-xl text-white backdrop-blur-xl">
          <div className="flex w-full justify-between bg-black">
            <span>Home</span>
            <HiOutlineSparkles className="mr-4 h-6 w-6" />
          </div>
        </div>
        <div className="mt-10 ml-4 flex w-full">
          <div className="h-100">
            <Image
              src={sessionData.user?.image as string}
              alt="User Image"
              width={50}
              height={50}
              className="rounded-full"
            />
          </div>
          <div className="flex w-full flex-col">
            <textarea
              name="tweettext"
              id="tweettext"
              placeholder="What's happening?"
              className="h-44 w-full resize-none bg-black px-4 text-zinc-300 outline-none"
              value={tweetText}
              maxLength={256}
              onChange={(e) => {
                setTweetText(e.target.value);
                setTweetLength(e.target.value.length);
              }}
            />
            <div className="flex w-full items-center justify-between px-4">
              <span className="text-slate-500">{`${tweetLength}/256`}</span>
              <button
                onClick={() => {
                  if (tweetLength > 0) {
                    createTweet.mutate({
                      createdById: sessionData.user?.id as string,
                      createdByImage: sessionData.user?.image as string,
                      createdByName: sessionData.user?.name as string,
                      text: tweetText,
                    });
                    setTweetText("");
                  }
                }}
                className="m-4 w-36 place-self-end rounded-3xl bg-sky-500 p-2 text-xl hover:bg-sky-600"
              >
                Tweet
              </button>
            </div>
          </div>
        </div>
        <div>
          {tweets.data && (
            <div ref={parent}>
              {tweets.data.map((tweet, index) => (
                <Tweet key={index} tweetInfo={tweet} />
              ))}
            </div>
          )}
        </div>
      </>
    </section>
  );
};

const Tweet = ({ tweetInfo }: { tweetInfo: Tweet }) => {
  return (
    <div className="flex border-b border-slate-700 p-4">
      <div className="h-100 ">
        <Image
          src={tweetInfo.createdByImage}
          alt="User Image"
          width={50}
          height={50}
          className="rounded-full"
        />
      </div>
      <div className="ml-4 flex w-full flex-col">
        <p className="font-bold text-white">{tweetInfo.createdByName}</p>
        <p className="text-white">{tweetInfo.text}</p>
        <div className="flex justify-between pt-2 text-slate-600">
          <button className=" hover:text-sky-500 ">
            <RiChat1Line className="mr-2 inline-block h-7 w-7 rounded-full p-1 hover:bg-sky-900 hover:bg-opacity-30" />
            {tweetInfo.comments}
          </button>

          <button className="hover:text-green-500">
            <AiOutlineRetweet className="mr-2 inline-block h-7 w-7 rounded-full p-1 hover:bg-green-900 hover:bg-opacity-30" />
            {tweetInfo.retweets}
          </button>

          <button className="hover:text-red-500">
            <RiHeart3Line className="mr-2 inline-block h-7 w-7 rounded-full p-1 hover:bg-red-900 hover:bg-opacity-30" />
            {tweetInfo.likes}
          </button>

          <button className=" hover:text-sky-500 ">
            <RxUpload className="mr-2 inline-block h-7 w-7 rounded-full p-1 hover:bg-sky-900 hover:bg-opacity-30" />
          </button>
        </div>
      </div>
    </div>
  );
};

const LeftSideNavigation = ({ sessionData }: { sessionData: Session }) => {
  return (
    <div className="w-2/3 justify-self-end border-r border-slate-700 2xl:w-2/5">
      <section className="sticky top-0 flex h-screen flex-col justify-between">
        <div className="flex flex-col items-center gap-y-6 text-white 2xl:items-start">
          <Link href="/" className="my-1">
            <span className="rounded-3xl border-slate-400 text-xl">
              <SiTwitter className="inline-block h-6 w-6" />
            </span>
          </Link>
          <Link href="/" className="my-1">
            <button className="rounded-3xl border-slate-400 text-xl  hover:bg-zinc-900">
              <RiHome8Fill className="inline-block h-6 w-6" />
              <span className="ml-4 hidden 2xl:inline-block">Home</span>
            </button>
          </Link>
          <Link href="/" className="my-1">
            <button className="rounded-3xl border-slate-400 text-xl  hover:bg-zinc-900">
              <BiHash className="inline-block h-6 w-6" />
              <span className="ml-4 hidden 2xl:inline-block">Explore</span>
            </button>
          </Link>
          <Link href="/" className="my-1">
            <button className="rounded-3xl border-slate-400 text-xl  hover:bg-zinc-900">
              <RiNotification2Line className="inline-block h-6 w-6" />
              <span className="ml-4 hidden 2xl:inline-block">
                Notifications
              </span>
            </button>
          </Link>
          <Link href="/" className="my-1">
            <button className="rounded-3xl border-slate-400 text-xl  hover:bg-zinc-900">
              <RiMailLine className="inline-block h-6 w-6" />
              <span className="ml-4 hidden 2xl:inline-block">Messages</span>
            </button>
          </Link>
          <Link href="/" className="my-1">
            <button className="rounded-3xl border-slate-400 text-xl  hover:bg-zinc-900">
              <RiBookmarkLine className="inline-block h-6 w-6" />
              <span className="ml-4 hidden 2xl:inline-block">Bookmarks</span>
            </button>
          </Link>
          <Link href="/" className="my-1">
            <button className="rounded-3xl border-slate-400 text-xl  hover:bg-zinc-900">
              <RiFileListLine className="inline-block h-6 w-6" />
              <span className="ml-4 hidden 2xl:inline-block">Lists</span>
            </button>
          </Link>
          <Link href="/" className="my-1">
            <button className="rounded-3xl border-slate-400 text-xl  hover:bg-zinc-900">
              <RiUserLine className="inline-block h-6 w-6" />
              <span className="ml-4 hidden 2xl:inline-block">Profile</span>
            </button>
          </Link>
          <Link href="/" className="my-1">
            <button className="rounded-3xl border-slate-400 text-xl  hover:bg-zinc-900">
              <CgMoreO className="inline-block h-6 w-6" />
              <span className="ml-4 hidden 2xl:inline-block">More</span>
            </button>
          </Link>
          <button
            className="rounded-3xl border-slate-400 text-xl  hover:bg-zinc-900"
            onClick={() => signOut()}
          >
            <RiLogoutBoxLine className="inline-block h-6 w-6" />
            <span className="ml-4 hidden 2xl:inline-block">Logout</span>
          </button>
          <button className="mr-4 hidden w-11/12 rounded-3xl bg-sky-500 p-3 text-xl hover:bg-sky-600 2xl:block">
            Tweet
          </button>
          <button className="rounded-full bg-sky-500 p-4 text-xl hover:bg-sky-600 2xl:hidden">
            <RiQuillPenLine />
          </button>
        </div>
        <button className="w-100 flex items-center justify-center rounded-full border-slate-700 p-4 hover:bg-zinc-900">
          <div className="h-100 ">
            <Image
              src={sessionData?.user?.image as string}
              alt="User Image"
              width={50}
              height={50}
              className="rounded-full"
            />
          </div>
          <div className="ml-2 hidden w-10/12 overflow-x-hidden text-ellipsis text-white 2xl:block">
            <p className="">{sessionData.user?.name}</p>
          </div>
          <RiMoreLine className="ml-4 hidden h-8 w-8 text-white 2xl:block" />
        </button>
      </section>
    </div>
  );
};

const RightSide = () => {
  return (
    <div className="hidden w-1/2 border-l border-slate-700 lg:block xl:col-span-1 xl:block">
      <section className="sticky top-0  mx-4 flex h-screen flex-col justify-between">
        <div className="flex flex-col  text-white">
          <div className="my-2">
            <RiSearch2Line className="absolute left-3 top-4 h-6 w-6 text-zinc-500 " />
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Search Twitter"
              className="rounded-full bg-gray-800 py-2 pl-12 pr-5 outline-none placeholder:text-zinc-500  focus:border-sky-500 focus:outline-sky-500"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
