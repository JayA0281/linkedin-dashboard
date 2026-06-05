import { useEffect, useState } from "react";

export default function App() {

  const [profiles, setProfiles] = useState([]);

  useEffect(() => {

    fetch("/linkedin-dashboard/data.json")
      .then((res) => res.json())
      .then((data) => {
        setProfiles(data);
      });

  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">

      <h1 className="text-4xl font-bold mb-8">
        LinkedIn Analytics Dashboard
      </h1>

      <div className="space-y-8">

        {profiles.map((profile, index) => (

          <div
            key={index}
            className="bg-slate-800 rounded-xl p-6"
          >

            <h2 className="text-2xl font-semibold break-all">
              {profile.profile}
            </h2>

            <div className="flex gap-6 mt-4">

              <div>
                Total Posts:
                <span className="ml-2 font-bold">
                  {profile.total_posts}
                </span>
              </div>

              <div>
                Original:
                <span className="ml-2 font-bold text-green-400">
                  {profile.original_posts}
                </span>
              </div>

              <div>
                Reposts:
                <span className="ml-2 font-bold text-red-400">
                  {profile.reposts}
                </span>
              </div>

            </div>

            <div className="mt-6 space-y-3">

              {profile.original_posts_data?.map((post, i) => (

                <div
                  key={i}
                  className="bg-slate-700 rounded-lg p-4 flex justify-between items-center gap-4"
                >

                  <a
                    href={post.post_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline break-all"
                  >
                    {post.post_url}
                  </a>

                  <div className="font-bold whitespace-nowrap">
                    👍 {post.reaction_count}
                  </div>

                </div>

              ))}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}