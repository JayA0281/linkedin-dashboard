import React, {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import Papa from "papaparse";

export default function Dashboard() {

  const [profiles, setProfiles] = useState([]);
  const [contacts, setContacts] = useState([]);

  const [search, setSearch] = useState("");
  const [minPosts, setMinPosts] = useState("");
  const [minReactions, setMinReactions] =
    useState("");

  const [selectedCompanies, setSelectedCompanies] =
    useState([]);

  const [companyDropdownOpen, setCompanyDropdownOpen] =
    useState(false);

  const dropdownRef = useRef(null);

  // ============================================
  // LOAD JSON
  // ============================================

  useEffect(() => {

    fetch("./data.json")
      .then((res) => res.json())
      .then((data) => {
        setProfiles(data);
      });

  }, []);

  // ============================================
  // LOAD CSV
  // ============================================

  useEffect(() => {

    Papa.parse("./contacts.csv", {

      download: true,
      header: true,

      complete: (results) => {
        setContacts(results.data);
      }

    });

  }, []);

  // ============================================
  // CLOSE DROPDOWN ON OUTSIDE CLICK
  // ============================================

  useEffect(() => {

    function handleClickOutside(event) {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {

        setCompanyDropdownOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);

  // ============================================
  // MERGE DATA
  // ============================================

  const mergedProfiles = useMemo(() => {

    return profiles.map((profile) => {

      const normalizedProfile =
        profile.profile
          .replace("https://", "")
          .replace("http://", "")
          .replace(/\/$/, "")
          .toLowerCase();

      const matched = contacts.find((contact) => {

        const contactUrl =
          contact["LinkedIn Contact Profile URL"]
            ?.replace("https://", "")
            ?.replace("http://", "")
            ?.replace(/\/$/, "")
            ?.toLowerCase();

        return normalizedProfile === contactUrl;
      });

      return {
        ...profile,

        person_name: matched
          ? `${matched["First Name"]} ${matched["Last Name"]}`
          : "Unknown",

        company_name:
          matched?.["Company Name"] || "",

        job_title:
          matched?.["Job Title"] || ""
      };
    });

  }, [profiles, contacts]);

  // ============================================
  // UNIQUE COMPANIES
  // ============================================

  const uniqueCompanies = useMemo(() => {

    return [...new Set(

      mergedProfiles
        .map((p) => p.company_name)
        .filter(Boolean)

    )].sort();

  }, [mergedProfiles]);

  // ============================================
  // TOGGLE COMPANY
  // ============================================

  function toggleCompany(company) {

    if (selectedCompanies.includes(company)) {

      setSelectedCompanies(
        selectedCompanies.filter(
          (c) => c !== company
        )
      );

    } else {

      setSelectedCompanies([
        ...selectedCompanies,
        company
      ]);
    }
  }

  // ============================================
  // FILTER
  // ============================================

  const filteredProfiles = useMemo(() => {

    return mergedProfiles.filter((profile) => {

      const searchTerm = search.toLowerCase();

      const matchesSearch =

        profile.person_name
          ?.toLowerCase()
          .includes(searchTerm)

        ||

        profile.job_title
          ?.toLowerCase()
          .includes(searchTerm)

        ||

        profile.company_name
          ?.toLowerCase()
          .includes(searchTerm);

      const matchesPosts =
        profile.original_posts >= minPosts;

      const matchesCompany =

        selectedCompanies.length === 0 ||

        selectedCompanies.includes(
          profile.company_name
        );

      return (
        matchesSearch &&
        matchesPosts &&
        matchesCompany
      );

    });

  }, [
    mergedProfiles,
    search,
    minPosts,
    selectedCompanies
  ]);

  // ============================================
  // UI
  // ============================================

  return (

    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">

      {/* NAVBAR */}

      <div className="
        sticky top-0 z-50
        bg-white/80
        backdrop-blur-xl
        border-b border-[#E2E8F0]
      ">

        <div className="
          max-w-7xl
          mx-auto
          px-8
          py-5
          flex
          items-center
          justify-between
        ">

          <div>

            <div className="
              text-sm
              tracking-[0.25em]
              uppercase
              text-[#2563EB]
              font-semibold
            ">
              LinkedIN Intelligence
            </div>

            <div className="
              text-2xl
              font-semibold
              mt-1
            ">
              LinkedIn Engagement Dashboard
            </div>

          </div>

        </div>

      </div>

      {/* HERO */}

      <div className="
        max-w-7xl
        mx-auto
        px-8
        pt-20
        pb-12
      ">

        <div className="
          grid
          gap-5
          items-start
        ">

          {/* LEFT */}

          <div>

            <h1 className="
              text-6xl
              leading-[1]
              font-semibold
            ">
              Contact database for Competitors
            </h1>

            <p className="
              text-[#64748B]
              leading-8
            ">

              This contains the LinkedIn profiles

            </p>

          </div>

          {/* RIGHT */}

          <div className="
            bg-[#EFF6FF]
            border border-[#DBEAFE]
            rounded-[32px]
            p-4
          ">

            <div className="space-y-5">

              {/* SEARCH */}

              <input
                type="text"
                placeholder="Search people..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="
                  w-full
                  bg-white
                  border border-[#E2E8F0]
                  rounded-2xl
                  px-4 py-2
                  outline-none
                  text-lg
                "
              />

              {/* MIN POSTS */}

              <input
                type="number"
                placeholder="Minimum original posts"
                value={minPosts}
                onChange={(e) =>
                  setMinPosts(Number(e.target.value))
                }
                className="
                  w-full
                  bg-white
                  border border-[#E2E8F0]
                  rounded-2xl
                  px-4 py-2
                  outline-none
                  text-lg
                "
              />

              {/* MIN REACTIONS */}

              <input
                type="number"
                placeholder="Minimum reactions"
                value={minReactions}
                onChange={(e) =>
                  setMinReactions(Number(e.target.value))
                }
                className="
                  w-full
                  bg-white
                  border border-[#E2E8F0]
                  rounded-2xl
                  px-4 py-2
                  outline-none
                  text-lg
                "
              />

            </div>

          </div>

        </div>

      </div>

      {/* TABLE */}

      <div className="
        max-w-7xl
        mx-auto
        px-8
        pb-20
      ">

        {/* HEADER */}

        <div className="
          grid
          grid-cols-10
          px-4
          py-2
          text-sm
          uppercase
          tracking-wide
          text-[#64748B]
          border-b
          border-[#E2E8F0]
        ">

          <div className="col-span-5">
            Person
          </div>

          {/* COMPANY HEADER */}

          <div
            ref={dropdownRef}
            className="
              col-span-3
              relative
            "
          >

            <button
              onClick={() =>
                setCompanyDropdownOpen(
                  !companyDropdownOpen
                )
              }
              className="
                flex
                items-center
                gap-2
                hover:text-[#2563EB]
                transition-colors
              "
            >

              <span>
                Company
              </span>

              <span className="
                text-xs
                transition-transform
              ">

                {companyDropdownOpen
                  ? "▲"
                  : "▼"
                }

              </span>

            </button>

            {/* DROPDOWN */}

            {companyDropdownOpen && (

              <div className="
                absolute
                top-full
                left-0
                mt-3
                w-[320px]
                bg-white
                border border-[#E2E8F0]
                rounded-2xl
                shadow-xl
                max-h-[320px]
                overflow-y-auto
                z-50
              ">

                {uniqueCompanies.map((company) => (

                  <label
                    key={company}
                    className="
                      flex
                      items-center
                      gap-3
                      px-5
                      py-4
                      hover:bg-[#F8FAFC]
                      cursor-pointer
                      normal-case
                      tracking-normal
                      text-[#0F172A]
                    "
                  >

                    <input
                      type="checkbox"
                      checked={
                        selectedCompanies.includes(
                          company
                        )
                      }
                      onChange={() =>
                        toggleCompany(company)
                      }
                    />

                    <span className="text-sm">
                      {company}
                    </span>

                  </label>

                ))}

              </div>
            )}

          </div>

          <div className="col-span-1">
            Original Posts
          </div>

          <div className="col-span-1">
            Reposts
          </div>

        </div>

        {/* ROWS */}

        <div className="
          divide-y
          divide-[#E2E8F0]
          bg-white
          rounded-b-[28px]
          overflow-hidden
          border-x
          border-b
          border-[#E2E8F0]
        ">

          {filteredProfiles.map((profile, index) => {

            return (

              <ExpandableRow
                key={index}
                profile={profile}
                minReactions={minReactions}
              />

            );
          })}

        </div>

      </div>

    </div>
  );
}

// ============================================
// EXPANDABLE ROW
// ============================================

function ExpandableRow({
  profile,
  minReactions
}) {

  const [open, setOpen] = useState(false);

  return (

    <div>

      {/* MAIN ROW */}

      <div
        onClick={() => setOpen(!open)}
        className="
          grid
          grid-cols-10
          items-center
          px-6
          py-3
          cursor-pointer
          hover:bg-[#F8FAFC]
          transition-colors
        "
      >

        {/* PERSON */}

        <div className="col-span-5">

          <a
            href={profile.profile}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="
              text-lg
              font-medium
              hover:text-[#2563EB]
            "
          >
            {profile.person_name}
          </a>

          <div className="
            text-sm
            text-[#64748B]
            mt-1
          ">
            {profile.job_title}
          </div>

        </div>

        {/* COMPANY */}

        <div className="
          col-span-3
          text-[#334155]
        ">
          {profile.company_name}
        </div>

        {/* POSTS */}

        <div className="
          col-span-1
          font-medium
        ">
          {profile.original_posts}
        </div>

        {/* REPOSTS */}

        <div className="
          col-span-1
          font-medium
          text-[#64748B]
        ">
          {profile.reposts}
        </div>

      </div>

      {/* EXPANDED SECTION */}

      {open && (

        <div className="
          bg-[#F8FAFC]
          border-t
          border-[#E2E8F0]
          px-6
          py-0
        ">

          <div className="space-y-0">

            {(profile.original_post_data || [])
              .filter(
                (post) =>
                  (post.reaction_count || 0)
                  >= minReactions
              ).length === 0 && (

              <div className="
                text-sm
                text-[#64748B]
                italic
              ">
                No posts match the current
                reaction filter.
              </div>
            )}

            {(profile.original_post_data || [])
              .filter(
                (post) =>
                  (post.reaction_count || 0)
                  >= minReactions
              )
              .map((post, i) => (

              <div
                key={i}
                className="
                  flex
                  items-center
                  justify-between
                  bg-white
                  rounded-l
                  px-4
                  py-1
                  border
                  border-[#E2E8F0]
                "
              >

                <a
                  href={post.post_url || post}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    text-[#2563EB]
                    hover:underline
                    break-all
                  "
                >
                  {post.post_url || post}
                </a>

                <div className="
                  whitespace-nowrap
                  font-medium
                  text-[#64748B]
                ">
                  {post.reaction_count || 0} reactions
                </div>

              </div>
            ))}

          </div>

        </div>
      )}

    </div>
  );
}