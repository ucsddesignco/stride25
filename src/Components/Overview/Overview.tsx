import "./Overview.scss";
import React from "react";
//import * as React from 'react'
import OnetoOne from "../../SVGS/Overview/OneToOne";
import CompanyInfo from "../../SVGS/Overview/CompanyInfo";
import ResumeReview from "../../SVGS/Overview/ResumeReview";

interface BoxProps {
  icon: React.ReactNode;
  title: string;
  variant: "primary" | "secondary" | "tertiary";
}

const Box: React.FC<BoxProps> = ({ icon, title, variant }) => {
  return (
    <div className={`box box--${variant}`}>
      <div className="box__icon">{icon}</div>
      <p className="box__title">{title}</p>
    </div>
  );
};

export default function overview() {
  return (
    <section id="overview">
      <div className="header">
        <h2>Gain insight and connect with professionals.</h2>
        <p>
          STRIDE is Design Co’s uniquely design-forward career fair. Held once a
          year, STRIDE connects students with company representatives for a day
          of networking, resume reviews, and recruiting sessions designed to
          jump-start industry careers.
        </p>
      </div>
      <div className="boxes-general">
        <Box icon={<OnetoOne />} title="1:1 Networking" variant="primary" />

        <Box
          icon={<CompanyInfo />}
          title="Company Info Sessions"
          variant="secondary"
        />

        <Box
          icon={<ResumeReview />}
          title="Resume Reviews"
          variant="tertiary"
        />
      </div>
    </section>
  );
}
