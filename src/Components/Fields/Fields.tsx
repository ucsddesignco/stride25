import useEmblaCarousel from "embla-carousel-react";
import "./Fields.scss";

const fieldsData = [
  { image: "/images/field1.png", text: "Product Design" },
  { image: "/images/field2.png", text: "Copywriting" },
  { image: "/images/field3.png", text: "Design Engineering" },
  { image: "/images/field4.png", text: "UX Research" },
  { image: "/images/field5.png", text: "Software Engineering" },
];

export default function Fields() {
  const [emblaRef] = useEmblaCarousel({
    loop: false,
    dragFree: true, 
    containScroll: "trimSnaps", 
  });

  return (
    <div className="fields-wrapper">
      <div className="fields-container embla" ref={emblaRef}>
        <div className="embla__container">
          {fieldsData.map((field, index) => (
            <div className="embla__slide field-card" key={index}>
              <img src={field.image} alt={field.text} className="field-image" />
              <p className="field-text">{field.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
