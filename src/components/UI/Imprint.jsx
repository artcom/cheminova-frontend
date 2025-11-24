import { styled } from "styled-components"

const Container = styled.div`
  max-width: 900px;
  padding: 32px;
  background: #fff;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  color: #222;
  height: 100%;
  overflow-y: auto;
`

const Title = styled.h1`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: #1a237e;
`

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 32px;
  margin-bottom: 12px;
  color: #3949ab;
`

const Paragraph = styled.p`
  font-size: 0.8rem;
  line-height: 1.7;
  margin-bottom: 16px;
`

const List = styled.ul`
  margin-left: 24px;
  margin-bottom: 16px;
`

const ListItem = styled.li`
  font-size: 0.7;
  line-height: 1.6;
  margin-bottom: 8px;
`

export default function Imprint() {
  return (
    <Container>
      <Title>Impressum / Imprint</Title>
      <SectionTitle>Vorstand / Board</SectionTitle>
      <Paragraph>Andreas Wiek</Paragraph>
      <SectionTitle>Aufsichtsrat / Supervisory Board</SectionTitle>
      <List>
        <ListItem>Volker Tietgens (Vorsitzender / Chairman)</ListItem>
        <ListItem>Dr. Miloš Stefanović</ListItem>
        <ListItem>Dr. Uwe S. Schuricht</ListItem>
      </List>
      <SectionTitle>Registergericht / Registered at</SectionTitle>
      <Paragraph>Amtsgericht Charlottenburg, Berlin</Paragraph>
      <SectionTitle>Registernummer / No.</SectionTitle>
      <Paragraph>HRB 68308</Paragraph>
      <SectionTitle>Umsatzsteuer-Identifikationsnummer / VAT ID</SectionTitle>
      <Paragraph>DE 811998328</Paragraph>
      <SectionTitle>Adresse / Address</SectionTitle>
      <Paragraph>
        ART+COM GmbH
        <br />
        Prinzessinnenstraße 1<br />
        10969 Berlin
        <br />
        Deutschland / Germany
        <br />
        Telefon / Telephone: +49 30 21001-0
        <br />
        info@artcom.de
      </Paragraph>
      <SectionTitle>Haftungshinweis / Note on liability</SectionTitle>
      <Paragraph>
        Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung
        für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten
        sind ausschließlich deren Betreiber verantwortlich.
        <br />
        <br />
        Although we make every effort to verify outside material we are unable
        to accept liability for the content of external links. Responsibility
        for this material lies solely with the relevant website owners.
      </Paragraph>
    </Container>
  )
}
