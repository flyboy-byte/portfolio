import { motion } from 'framer-motion';
  import React, { useState, useEffect } from 'react';
  import { Tilt } from 'react-tilt';
  import { services } from '../constants';
  import { SectionWrapper } from '../hoc';
  import { styles } from '../styles';
  import { fadeIn, textVariant } from '../utils/motion';
  const useMobile = () => {
    const [m, setM] = useState(false);
    useEffect(() => {
      const mq = window.matchMedia("(max-width: 768px)");
      setM(mq.matches);
      const h = e => setM(e.matches);
      mq.addEventListener("change", h);
      return () => mq.removeEventListener("change", h);
    }, []);
    return m;
  };
  const ServiceCard = ({ index, title, icon }) => {
    const isMobile = useMobile();
    return (
    <Tilt options={{ max: isMobile ? 0 : 25, scale: 1, speed: 450 }} className="xs:w-[250px] w-full">
      <motion.div variants={fadeIn('right','spring',index*0.5,0.75)} className="w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card">
        <div className="bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col">
          <img src={icon} alt={title} className="w-16 h-16 object-contain" loading="lazy" />
          <h3 className="text-white text-[20px] font-bold text-center">{title}</h3>
        </div>
      </motion.div>
    </Tilt>
    );
  };
  const About = () => (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Who I am</p>
        <h2 className={styles.sectionHeadText}>Overview</h2>
      </motion.div>
      <motion.p variants={fadeIn('','',0.1,1)} className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]">
        I'm a GM ASEP automotive student and hands-on maker with ASE certifications in engine repair,
        electrical/electronic systems, steering &amp; suspension, brakes, heating &amp; air conditioning, light vehicle diesel engines, manual drive train &amp; axles, and automatic transmission/transaxle. I build practical projects that mix hardware, Linux,
        and open-source tooling — ESP32 sensors, drag racing timers, FOSS dashboards, and whatever else
        solves a real problem. If it breaks, I want the datasheet, the wiring diagram, and the log file.
      </motion.p>
      <div className="mt-20 flex flex-wrap gap-10">
        {services.map((s,i) => <ServiceCard key={s.title} index={i} {...s} />)}
      </div>
    </>
  );
  export default SectionWrapper(About, 'about');