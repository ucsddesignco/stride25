import { accordionData } from "./data"
import './Accordion.scss'
import * as React from 'react';
import { styled } from '@mui/material/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import MuiAccordion, { type AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {type AccordionSummaryProps, accordionSummaryClasses,} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<PlayArrowIcon sx={{ fontSize: '0.9rem', color: "#B8E5ED" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: 'rotate(90deg)',
    },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles('dark', {
    backgroundColor: 'rgba(255, 255, 255, .05)',
  }),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function CustomizedAccordions() {
  const [expanded, setExpanded] = React.useState<string | false>('panel1');

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  // Split accordionData into two groups of 3
  const firstColumn = accordionData.slice(0, 3);
  const secondColumn = accordionData.slice(3, 6);

  return (
    <section id="faq">
      <div className="faqText">
        <h1>Frequently Asked Questions</h1>
        <p>Any other questions? Reach out via <span>Instagram</span> or <span>designatucsd@gmail.com</span></p>
      </div>
      <div className="accordionContainer">
        {/* first column */}
        <div className="accordion1">
          {firstColumn.map((item) => (
            <Accordion 
              key={item.question}
              expanded={expanded === item.question} 
              onChange={handleChange(item.question)}
            >
              <AccordionSummary 
                aria-controls={`${item.question}d-content`} 
                id={`${item.question}d-header`}
              >
                <Typography component="span">{item.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>

        {/* second column */}
        <div className="accordion2">
          {secondColumn.map((item) => (
            <Accordion 
              key={item.question}
              expanded={expanded === item.question} 
              onChange={handleChange(item.question)}
            >
              <AccordionSummary 
                aria-controls={`${item.question}d-content`} 
                id={`${item.question}d-header`}
              >
                <Typography component="span">{item.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
}