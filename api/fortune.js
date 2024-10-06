require('dotenv').config();
const { Anthropic } = require('@anthropic-ai/sdk');
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const hexagramTable = require('./hexagramTable');
const database = require('./database.json');

function solarToLunar(solarDate) {
  console.log('Input solarDate:', solarDate);
  const lunarDate = (solarDate); // Placeholder for actual conversion
  console.log('Lunar Date:', lunarDate);
  return lunarDate;
}

function calculateN1(year) {
  const baseYear = 2023;
  const baseN1 = 4;
  let n1 = ((year - baseYear + baseN1 - 1) % 12) + 1;
  return n1.toString().padStart(2, '0');
}

function calculateN4(time) {
  const hour = parseInt(time.split(':')[0]);
  const n4 = Math.floor(((hour + 1) % 24) / 2) + 1;
  return n4.toString().padStart(2, '0');
}

function calculateHexagram(date, time) {
  const lunarDate = solarToLunar(date);
  const [day, month, year] = lunarDate.split('/');

  const N1 = calculateN1(parseInt(year));
  const N2 = month;
  const N3 = day;
  const N4 = calculateN4(time);
  
  const N5 = (parseInt(N1) + parseInt(N2) + parseInt(N3)).toString();
  const N6 = (parseInt(N5) % 8) || 8;
  const N7 = (parseInt(N1) + parseInt(N2) + parseInt(N3) + parseInt(N4)).toString();
  const N8 = (parseInt(N7) % 8) || 8;

  console.log('N1:', N1, 'N2:', N2, 'N3:', N3, 'N4:', N4, 'N5:', N5, 'N6:', N6, 'N7:', N7, 'N8:', N8);
  
  return { N6, N8 };
}

async function callAnthropicAPI(content, question) {
  try {
    const msg = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 450,
      temperature: 1,
      system: "hay coi boi",
      messages: [
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": `Đây là nội dung quẻ bói của khách hàng: \"${content}\", Đây là câu hỏi của khách hàng: \"${question}\", Bây giờ hãy dựa vào nội dung quẻ bói và trả lời khách đi nào.`
            }
          ]
        }
      ]
    });
    console.log(msg);
    return msg.content[0].text;
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    return 'An error occurred while generating your fortune. Please try again.';
  }
}

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { date, time, question } = req.body;
      const { N6, N8 } = calculateHexagram(date, time);
      const preliminaryResult = hexagramTable[N8 - 1][N6 - 1];

      console.log('Preliminary Result:', preliminaryResult);

      const content = database[preliminaryResult];

      const answer = await callAnthropicAPI(content, question);

      res.status(200).json({
        fortune: answer,
        preliminaryResult: preliminaryResult
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while generating your fortune.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};