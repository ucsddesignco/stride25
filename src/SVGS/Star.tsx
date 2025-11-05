interface StarProps {
    className?: string;
}

export default function Star({ className }: StarProps) {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <rect y="9.95703" width="14.0814" height="14.0814" transform="rotate(-45 0 9.95703)" fill="#D3F4FA" />
        </svg>
    );
}