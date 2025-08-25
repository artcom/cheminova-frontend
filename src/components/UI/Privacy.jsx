import styled from "styled-components"

const Container = styled.div`
  max-width: 900px;
  padding: 32px;
  background: #fff;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  color: #222;
`

const Title = styled.h1`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: #1a237e;
`

const SectionTitle = styled.h2`
  font-size: 1.2rem;
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
  font-size: 0.7rem;
  line-height: 1.6;
  margin-bottom: 8px;
`

const Link = styled.a`
  color: #1976d2;
  text-decoration: underline;
`

const Privacy = () => (
  <Container>
    <Title>Datenschutzerklärung / Privacy Policy</Title>
    <SectionTitle>Allgemeiner Hinweis und Pflichtinformationen</SectionTitle>
    <Paragraph>
      <strong>Benennung der verantwortlichen Stelle</strong>
      <br />
      Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website
      ist:
      <br />
      ART+COM GmbH, Prinzessinnenstr. 1, 10969 Berlin
      <br />
      Die verantwortliche Stelle entscheidet allein oder gemeinsam mit anderen
      über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten
      (z.B. Namen, Kontaktdaten o. Ä.).
    </Paragraph>
    <SectionTitle>
      Widerruf Ihrer Einwilligung zur Datenverarbeitung
    </SectionTitle>
    <Paragraph>
      Nur mit Ihrer ausdrücklichen Einwilligung sind einige Vorgänge der
      Datenverarbeitung möglich. Ein Widerruf Ihrer bereits erteilten
      Einwilligung ist jederzeit möglich. Für den Widerruf genügt eine formlose
      Mitteilung per E-Mail. Die Rechtmäßigkeit der bis zum Widerruf erfolgten
      Datenverarbeitung bleibt vom Widerruf unberührt.
    </Paragraph>
    <SectionTitle>
      Recht auf Beschwerde bei der zuständigen Aufsichtsbehörde
    </SectionTitle>
    <Paragraph>
      Als Betroffener steht Ihnen im Falle eines datenschutzrechtlichen
      Verstoßes ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.
      Zuständige Aufsichtsbehörde bezüglich datenschutzrechtlicher Fragen ist
      der Landesdatenschutzbeauftragte des Bundeslandes, in dem sich der Sitz
      unseres Unternehmens befindet. Der folgende Link stellt eine Liste der
      Datenschutzbeauftragten sowie deren Kontaktdaten bereit:{" "}
      <Link
        href="https://www.bfdi.bund.de/DE/Infothek/Anschriften_Links/anschriften_links-node.html"
        target="_blank"
        rel="noopener noreferrer"
      >
        bfdi.bund.de
      </Link>
      .
    </Paragraph>
    <SectionTitle>Recht auf Datenübertragbarkeit</SectionTitle>
    <Paragraph>
      Ihnen steht das Recht zu, Daten, die wir auf Grundlage Ihrer Einwilligung
      oder in Erfüllung eines Vertrags automatisiert verarbeiten, an sich oder
      an Dritte aushändigen zu lassen. Die Bereitstellung erfolgt in einem
      maschinenlesbaren Format. Sofern Sie die direkte Übertragung der Daten an
      einen anderen Verantwortlichen verlangen, erfolgt dies nur, soweit es
      technisch machbar ist.
    </Paragraph>
    <SectionTitle>
      Recht auf Auskunft, Berichtigung, Sperrung, Löschung
    </SectionTitle>
    <Paragraph>
      Sie haben jederzeit im Rahmen der geltenden gesetzlichen Bestimmungen das
      Recht auf unentgeltliche Auskunft über Ihre gespeicherten
      personenbezogenen Daten, Herkunft der Daten, deren Empfänger und den Zweck
      der Datenverarbeitung und ggf. ein Recht auf Berichtigung, Sperrung oder
      Löschung dieser Daten. Diesbezüglich und auch zu weiteren Fragen zum Thema
      personenbezogene Daten können Sie sich jederzeit über die im Impressum
      aufgeführten Kontaktmöglichkeiten artcom.de
    </Paragraph>
    <SectionTitle>SSL- bzw. TLS-Verschlüsselung</SectionTitle>
    <Paragraph>
      Aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher
      Inhalte, die Sie an uns als Seitenbetreiber senden, nutzt unsere Website
      eine SSL-bzw. TLS-Verschlüsselung. Damit sind Daten, die Sie über diese
      Website übermitteln, für Dritte nicht mitlesbar. Sie erkennen eine
      verschlüsselte Verbindung an der „https://“ Adresszeile Ihres Browsers und
      am Schloss-Symbol in der Browserzeile.
    </Paragraph>
    <SectionTitle>Datenschutzbeauftragter</SectionTitle>
    <Paragraph>
      Wir haben einen Datenschutzbeauftragten bestellt.
      <br />
      Jürgen Geuter, Prinzessinnenstr. 1, 10969 Berlin
      <br />
      Telefon: +49 30 21001-0
      <br />
      E-Mail: datenschutz@artcom.de
    </Paragraph>
    <SectionTitle>Server-Log-Dateien</SectionTitle>
    <Paragraph>
      In Server-Log-Dateien erheben und speichern wir zum Zwecke der Überwachung
      der Funktion des angebotenen Dienstes automatisch Informationen, die Ihr
      Browser automatisch an uns übermittelt. Dies sind:
    </Paragraph>
    <List>
      <ListItem>Besuchte Seite auf unserer Domain</ListItem>
      <ListItem>Datum und Uhrzeit der Serveranfrage</ListItem>
      <ListItem>Browsertyp und Browserversion</ListItem>
      <ListItem>Verwendetes Betriebssystem</ListItem>
      <ListItem>Referrer URL</ListItem>
      <ListItem>Hostname des zugreifenden Rechners</ListItem>
      <ListItem>IP-Adresse</ListItem>
    </List>
    <Paragraph>
      Es findet keine Zusammenführung dieser Daten mit anderen Datenquellen
      statt. Grundlage der Datenverarbeitung bildet Art. 6 Abs. 1 lit. b DSGVO,
      der die Verarbeitung von Daten zur Erfüllung eines Vertrags oder
      vorvertraglicher Maßnahmen gestattet.
    </Paragraph>
    <SectionTitle>Privacy policy</SectionTitle>
    <Paragraph>
      The information in this declaration applies to the processing of personal
      data on or via our website and is intended in particular to inform you of
      the scope of processing, the purposes of processing, the recipients, legal
      bases, storage periods and your rights. Personal data are all information
      relating to an identified or identifiable natural person, i.e. a human
      being (hereinafter also referred to as “data subject”), including for
      example your name, your address or your e-mail address.
      &quot;Processing&quot; of personal data means in particular the
      collection, storage, use and transmission of such data.
    </Paragraph>
    <SectionTitle>Name and Address of the controller</SectionTitle>
    <Paragraph>
      The controller within the meaning of the General Data Protection
      Regulation (GDPR) and other national data protection laws of the member
      states as well as other data protection regulations is:
      <br />
      ART+COM GmbH
      <br />
      Prinzessinnenstraße 1<br />
      10969 Berlin
      <br />
      Germany
      <br />
      Phone +49 30 21001-0
      <br />
      info@artcom.de www.artcom.de
    </Paragraph>
    <SectionTitle>Contact data of the data protection officer</SectionTitle>
    <Paragraph>
      The data protection officer can be consulted under the following contact
      details:
      <br />
      Data Protection Officer
      <br />
      c/o ART+COM GmbH
      <br />
      Prinzessinnenstraße 1<br />
      10969 Berlin
      <br />
      Germany
      <br />
      privacy@artcom.de
    </Paragraph>
    <SectionTitle>General information data processing</SectionTitle>
    <Paragraph>
      <strong>1. Legal basis for the processing of personal data</strong>
      <br />
      Insofar as the data subject has given consent to the processing of his or
      her personal data for one or more specific purposes, legal basis is Art. 6
      para. 1 lit. a GDPR. Insofar as the processing is necessary for the
      performance of a contract to which the data subject is party or in order
      to take steps at the request of the data subject prior to entering into a
      contract, legal basis is Art. 6 para. 1 lit. b GDPR. Insofar as the
      processing is necessary for compliance with a legal obligation to which
      the controller is subject, legal basis is Art. 6 para. 1 lit. c GDPR. If
      processing is necessary for the purposes of the legitimate interests
      pursued by the controller or by a third party, except where such interests
      are overridden by the interests or fundamental rights and freedoms of the
      data subject which require protection of personal data, legal basis is
      Art. 6 para. 1 lit. f GDPR.
    </Paragraph>
    <SectionTitle>Data erasure and storage time</SectionTitle>
    <Paragraph>
      The personal data of the data subject will be erased or processing
      restricted as soon as the purpose of storage ceases to apply. In certain
      cases, data can be stored if this has been provided for by the European or
      national legislator in EU regulations, laws or other provisions to which
      the controller is subject.
    </Paragraph>
    <SectionTitle>
      Provision of the website and creation of log files
    </SectionTitle>
    <Paragraph>
      <strong>1. Description and extent of data processing</strong>
      <br />
      Every time you visit our website, our system automatically collects data
      and information from the computer system of the accessing device
      (computer, smartphone, tablet, etc.). The following data is collected:
    </Paragraph>
    <List>
      <ListItem>
        Information about the browser type, the version used, installed plugins
        and the set language
      </ListItem>
      <ListItem>
        The operating system of the accessing device and its version
      </ListItem>
      <ListItem>The IP address of the accessing device</ListItem>
      <ListItem>Date and time of access and time spent on the site</ListItem>
      <ListItem>
        Loading time of the pages (average value for all accessed pages of the
        session)
      </ListItem>
      <ListItem>
        Websites from which the system of the accessing device reaches our
        website
      </ListItem>
      <ListItem>
        Websites that are accessed by the user device on our website
      </ListItem>
    </List>
    <Paragraph>
      This data is also stored in the log files of our system. This data is not
      stored together with other personal data of the user.
    </Paragraph>
    <Paragraph>
      <strong>2. Legal basis for data processing</strong>
      <br />
      Legal basis for the temporary storage of data and log files is Art. 6
      para. 1 lit. f GDPR.
    </Paragraph>
    <Paragraph>
      <strong>3. Purpose of data processing</strong>
      <br />
      The temporary storage of the IP address by the system is necessary to
      enable the website to be delivered to the user’s device. For this the IP
      address of the user must remain stored for the duration of the session.
      The data is stored in log files to ensure and improve the functionality of
      the website and for statistical evaluations. In addition, the data serves
      us to optimize the website and to ensure the security of our information
      technology systems. An evaluation of the data for marketing purposes does
      not take place in this context. Our legitimate interest in data processing
      also lies in these purposes.
    </Paragraph>
    <Paragraph>
      <strong>4. Possibility of opposition and elimination</strong>
      <br />
      The collection of data for the provision of the website and the storage of
      data in log files is absolutely necessary for the operation of the
      website. Consequently, there is no possibility of objection on the part of
      the user.
    </Paragraph>
    <SectionTitle>Rights of the data subject</SectionTitle>
    <Paragraph>
      If your personal data are processed, you are a data subject within the
      meaning of the GDPR and you have the following rights against the
      controller (in the case of the fulfilment of further conditions regulated
      in the relevant regulations, if applicable):
    </Paragraph>
    <List>
      <ListItem>The right of access according to Art. 15 GDPR</ListItem>
      <ListItem>The right to rectification according to Art. 16 GDPR</ListItem>
      <ListItem>
        The right to erasure (“right to be forgotten”) according to Art. 17 GDPR
      </ListItem>
      <ListItem>
        The right to restriction of processing according to Art. 18 GDPR
      </ListItem>
      <ListItem>The right to a notification according to Art. 19 GDPR</ListItem>
      <ListItem>
        The right to data portability according to Art. 20 GDPR
      </ListItem>
      <ListItem>The right to object according to Art. 21 GDPR</ListItem>
      <ListItem>
        The right not to be subject to a decision based solely on automated
        processing according to Art. 22 GDPR
      </ListItem>
      <ListItem>
        The right to withdraw consent to the processing of personal data
        according to Art. 7 para. 3 GDPR
      </ListItem>
    </List>
    <Paragraph>
      To assert these rights, please contact our data protection officer at the
      aforementioned address.
    </Paragraph>
    <Paragraph>
      Without prejudice to any other administrative or judicial remedy, you also
      have the right to lodge a complaint with a supervisory authority, in
      particular in the Member State where you are staying, working or suspected
      of infringing, if you believe that the processing of personal data
      concerning you infringes the GDPR.
    </Paragraph>
    <SectionTitle>Security</SectionTitle>
    <Paragraph>
      In accordance with the &quot;Privacy By Design&quot; principle, all
      traffic exchanged between the user&apos;s browser and ART+COM servers is
      encrypted via SSL/TLS.
    </Paragraph>
  </Container>
)

export default Privacy
