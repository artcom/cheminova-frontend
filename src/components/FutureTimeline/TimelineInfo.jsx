import {
  DateTime,
  InfoContent,
  InfoDivider,
  InfoSection,
  Title,
} from "./styles"

export function TimelineInfo({ title, descriptionLines }) {
  return (
    <InfoSection>
      <InfoContent>
        <Title>{title}</Title>
        <DateTime>
          {descriptionLines.map((line, index) => (
            <p key={`timeline-info-line-${index}`}>{line}</p>
          ))}
        </DateTime>
      </InfoContent>
      <InfoDivider aria-hidden />
    </InfoSection>
  )
}
