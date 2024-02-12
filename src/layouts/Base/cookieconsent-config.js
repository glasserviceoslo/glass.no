import 'https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@v3.0.0/dist/cookieconsent.umd.js';

CookieConsent.run({
  language: {
    default: 'no',
    translations: {
      no: {
        consent_modal: {
          title: 'Vi bruker informasjonskapsler!',
          description:
            'Hei, dette nettstedet bruker nødvendige informasjonskapsler for å sikre riktig drift og sporing av informasjonskapsler for å forstå hvordan du samhandler med det. Sistnevnte vil kun bli satt etter samtykke. <button type="button" data-cc="c-settings" class="cc-link">Instillinger</button>',
          primary_btn: {
            text: 'Godta alle',
            role: 'accept_all',
          },
          secondary_btn: {
            text: 'Avvis alle',
            role: 'accept_necessary',
          },
        },
        settings_modal: {
          title: 'Innstillinger for informasjonskapsler',
          save_settings_btn: 'Lagre innstillinger',
          accept_all_btn: 'Godta alle',
          reject_all_btn: 'Avvis alle',
          close_btn_label: 'Lukk',
          cookie_table_headers: [
            {
              col1: 'Navn',
            },
            {
              col2: 'Domene',
            },
            {
              col3: 'Utløpsdato',
            },
            {
              col4: 'Beskrivelse',
            },
          ],
          blocks: [
            {
              title: 'Bruk av informasjonskapsler 📢',
              description:
                'Jeg bruker informasjonskapsler for å sikre de grunnleggende funksjonene på nettstedet og forbedre din online opplevelse. Du kan velge for hver kategori om du vil delta eller ikke når som helst. For flere detaljer relatert til informasjonskapsler og annen sensitiv data, vennligst les fullstendig <a href="#" class="cc-link">personvernpolicy</a>.',
            },
            {
              title: 'Strengt nødvendige informasjonskapsler',
              description:
                'Disse informasjonskapslene er essensielle for riktig funksjon av mitt nettsted. Uten disse informasjonskapslene ville nettstedet ikke fungere ordentlig',
              toggle: {
                value: 'necessary',
                enabled: true,
                readonly: true,
              },
            },
            {
              title: 'Ytelse og analyse-informasjonskapsler',
              description: 'Disse informasjonskapslene lar nettstedet huske valgene du har gjort tidligere',
              toggle: {
                value: 'analytics',
                enabled: false,
                readonly: false,
              },
              cookie_table: [
                {
                  col1: '^_ga',
                  col2: 'google.com',
                  col3: '2 år',
                  col4: 'beskrivelse ...',
                  is_regex: true,
                },
              ],
            },
            {
              title: 'Annonsering og målrettede informasjonskapsler',
              description:
                'Disse informasjonskapslene samler inn informasjon om hvordan du bruker nettstedet, hvilke sider du har besøkt, og hvilke linker du har klikket på. Alle dataene er anonymisert og kan ikke brukes til å identifisere deg',
              toggle: {
                value: 'targeting',
                enabled: false,
                readonly: false,
              },
            },
            {
              title: 'Mer informasjon',
              description:
                'For spørsmål angående vår informasjonskapselpolicy og dine valg, vennligst <a class="cc-link" href="kontakt">kontakt oss</a>.',
            },
          ],
        },
      },
    },
  },
});
