// Adapted from the Uiverse button by cssbuttons-io.
export default function LearnMoreButton({ children, onClick }) {
  return (
    <button className="learn-more" type="button" onClick={onClick}>
      <span className="learn-more__circle" aria-hidden="true">
        <span className="learn-more__arrow" />
      </span>
      <span className="learn-more__text">{children}</span>
    </button>
  )
}
