import React, { useRef, useState } from "react";
  import { motion } from "framer-motion";
  import emailjs from "@emailjs/browser";
  import { styles } from "../styles";
  import { EarthCanvas } from "./canvas";
  import { SectionWrapper } from "../hoc";
  import { slideIn } from "../utils/motion";
  // TODO: Replace with your own EmailJS credentials → https://emailjs.com
  const SVC="YOUR_SERVICE_ID", TMPL="YOUR_TEMPLATE_ID", KEY="YOUR_PUBLIC_KEY";
  const Contact = () => {
    const formRef = useRef();
    const [form, setForm] = useState({ name:"", email:"", message:"" });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const onChange = e => setForm({...form,[e.target.name]:e.target.value});
    const onSubmit = e => {
      e.preventDefault(); setLoading(true);
      emailjs.send(SVC,TMPL,{from_name:form.name,to_name:"Logan Night",from_email:form.email,to_email:"your-email@example.com",message:form.message},KEY)
        .then(()=>{setLoading(false);setStatus("Thanks! I'll get back to you.");setForm({name:"",email:"",message:""});})
        .catch(()=>{setLoading(false);setStatus("Something went wrong — please try again.");});
    };
    return (
      <div className="xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden">
        <motion.div variants={slideIn("left","tween",0.2,1)} className="flex-[0.75] bg-black-100 p-8 rounded-2xl">
          <p className={styles.sectionSubText}>Get in touch</p>
          <h3 className={styles.sectionHeadText}>Contact</h3>
          <form ref={formRef} onSubmit={onSubmit} className="mt-12 flex flex-col gap-8">
            {[["Name","name","text","Your name"],["Email","email","email","your@email.com"],["Message","message","text","What's up?"]].map(([label,name,type,ph])=>(
              <label key={name} className="flex flex-col">
                <span className="text-white font-medium mb-4">{label}</span>
                <input type={type} name={name} value={form[name]} onChange={onChange} placeholder={ph}
                  className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium" />
              </label>
            ))}
            <button type="submit" className="bg-tertiary py-3 px-8 rounded-xl text-white font-bold shadow-md shadow-primary w-fit">
              {loading?"Sending…":"Send"}
            </button>
            {status && <p className="text-green-400 mt-2">{status}</p>}
          </form>
        </motion.div>
        <motion.div variants={slideIn("right","tween",0.2,1)} className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]">
          <EarthCanvas />
        </motion.div>
      </div>
    );
  };
  export default SectionWrapper(Contact,"contact");