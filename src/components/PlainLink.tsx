interface PlainLinkProps {
  linkText: string;
  hyperReference: string;
}

export default function PlainLink({
  linkText,
  hyperReference
}: PlainLinkProps) {
  return (
    <a
      href={hyperReference}
      className="text-blue-600 visited:text-purple-600 hover:underline"
    >
      {linkText}
    </a>
  );
}

