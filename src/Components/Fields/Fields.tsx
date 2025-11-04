import useEmblaCarousel from "embla-carousel-react";
import "./Fields.scss";

const fieldsData = [
  { image: "/images/FieldsSVG/Product Design.svg", text: "Product Design" },
  { image: "/images/FieldsSVG/Copywriting.svg", text: "Copywriting" },
  { image: "/images/FieldsSVG/Design Engineering.svg", text: "Design Engineering" },
  { image: "/images/FieldsSVG/UX Research.svg", text: "UX Research" },
  { image: "/images/FieldsSVG/Software Engineering.svg", text: "Software Engineering" },
];

export default function Fields() {
  const [emblaRef] = useEmblaCarousel({
    loop: false,
    dragFree: true,
    containScroll: "trimSnaps",
  });

  return (
    <div className="fields">
      <p className="fields-title">
        Discover Fields Dedicated to Craft & Problem Solving
      </p>
      <div className="fields-wrapper">
        <div className="fields-container embla" ref={emblaRef}>
          <div className="embla__container">
            {fieldsData.map((field, index) => (
              <div className="embla__slide field-card" key={index}>
                <img
                  src={field.image}
                  alt={field.text}
                  className="field-image"
                />
                <p className="field-text">{field.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
