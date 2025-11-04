import React from 'react';
import Image from 'next/image';
import { ArrowUpRightIcon } from '@/components/svgs';
import { useRouter } from 'next/navigation';

type Props = {
  imageSrc: string;
  title: string;
  name: string;
  description?: string;
  avatarSrc: string;
  nameAuthor?: string;
  date?: string;
  id: number;
};

const BlogCard: React.FC<Props> = ({
  imageSrc,
  title,
  name,
  description,
  nameAuthor,
  date,
  avatarSrc,
  id,
}) => {
  const { push } = useRouter();

  return (
    <div
      className="blogs__card flex flex-col h-full"
      onClick={() => push(`/blogs/${id}`)}
    >
      <Image
        src={imageSrc}
        alt="Blog Image"
        width={336}
        height={240}
        className="blogs__card--image"
      />

      <div className="flex flex-col flex-1 justify-between mt-4">
        <div>
          <h4>{title}</h4>
          <div className="flex gap-16 items-base justify-between pb-4">
            <h2 className="flex-1 ">{name}</h2>
            <ArrowUpRightIcon className="svg" />
          </div>
          {description && <p>{description}</p>}
        </div>

        <div className="blogs__card--auth flex gap-8 items-center mt-6">
          <Image
            src={avatarSrc}
            alt="Author Avatar"
            width={40}
            height={40}
            className="blogs__card--auth-avatar"
          />
          <div className="ml-3">
            <h5 className="name">{nameAuthor}</h5>
            <p className="date text-sm text-gray-500">{date}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
