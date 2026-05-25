import React from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { papers } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

const PaperCard = ({ index, title, description, tags, link }) => (
  <motion.div variants={fadeIn("up", "spring", index * 0.15, 0.75)}>
    <div
      onClick={() => window.open(link, "_blank")}
      className="bg-tertiary p-6 rounded-2xl w-full cursor-pointer hover:bg-[#2a2060] transition-colors duration-200 border border-transparent hover:border-[#915EFF]/40"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-white font-bold text-[20px] leading-snug">{title}</h3>
          <p className="mt-2 text-secondary text-[14px] leading-relaxed">{description}</p>
        </div>
        <div className="flex-shrink-0 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#915EFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="text-[12px] px-2 py-0.5 rounded-full bg-[#915EFF]/20 text-[#915EFF] font-medium">
            {tag}
          </span>
        ))}
      </div>
    </div>
  </motion.div>
);

const Papers = () => (
  <>
    <motion.div variants={textVariant()}>
      <p className={styles.sectionSubText}>Technical writing</p>
      <h2 className={styles.sectionHeadText}>Whitepapers</h2>
    </motion.div>
    <motion.p variants={fadeIn("", "", 0.1, 1)} className="mt-4 mb-10 text-secondary text-[17px] max-w-3xl leading-[30px]">
      Deep-dives and reference documents on topics I find worth writing down.
    </motion.p>
    <div className="flex flex-col gap-5">
      {papers.map((paper, i) => (
        <PaperCard key={paper.title} index={i} {...paper} />
      ))}
    </div>
  </>
);

export default SectionWrapper(Papers, "papers");
