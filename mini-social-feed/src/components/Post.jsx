import React, { useState, useCallback } from "react";
import { Heart, MessageCircleMore } from "lucide-react";

function Post({ title, image, comment, like }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(like);

  const handleLike = useCallback(() => {
    setCount((prev) => (liked ? prev - 1 : prev + 1));
    setLiked((prev) => !prev);
  }, [liked]);

  

  return (
    <div className="
      max-w-[350px] w-full border border-slate-300 
      rounded-2xl shadow-sm bg-white overflow-hidden
      hover:shadow-md transition-shadow duration-200
    ">
      
      <div className="p-4">
        <h1 className="text-lg font-semibold text-slate-800 line-clamp-2">
          {title}
        </h1>
      </div>

      <div className="w-full h-[240px] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="
            h-full w-full object-cover 
            transition-transform duration-300 hover:scale-105
          "
        />
      </div>

      <div className="flex items-center gap-3 p-4 text-slate-700">

        <div
          className="flex items-center gap-1 text-sm font-medium cursor-pointer select-none"
          onClick={handleLike}
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              liked ? "text-red-500 fill-red-500" : ""
            }`}
          />
          {count}
        </div>

        <div className="flex items-center gap-1 text-sm font-medium">
          <MessageCircleMore className="h-5 w-5" /> {comment}
        </div>
      </div>

    </div>
  );
}

export default Post;
