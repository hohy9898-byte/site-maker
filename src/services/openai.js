import { loadData } from "./data";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const MODEL = import.meta.env.VITE_OPENAI_MODEL;

export async function askGPT(question) {

  // JSON 데이터 불러오기
  const data = await loadData();

  // GPT에게 전달할 데이터 (너무 길면 일부만 전달)
  const context = `
[부산 숙박 데이터]
${JSON.stringify(data.stay).slice(0, 8000)}

[부산 축제 데이터]
${JSON.stringify(data.festival).slice(0, 8000)}

[부산 관광지 데이터]
${JSON.stringify(data.tour).slice(0, 8000)}

[부산 레포츠 데이터]
${JSON.stringify(data.leisure).slice(0, 8000)}

[부산 문화시설 데이터]
${JSON.stringify(data.culture).slice(0, 8000)}

[부산 쇼핑 데이터]
${JSON.stringify(data.shopping).slice(0, 8000)}

[부산 여행코스 데이터]
${JSON.stringify(data.course).slice(0, 8000)}
`;

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: `
당신은 부산 관광 전문 챗봇입니다.

반드시 아래 JSON 데이터를 우선 참고하여 답변하세요.

규칙
1. 데이터에 있는 내용이면 데이터를 기반으로 답변한다.
2. 데이터에 없으면 일반 관광 지식으로 답변한다.
3. 숙박 질문은 숙박 데이터를 참고한다.
4. 축제 질문은 축제 데이터를 참고한다.
5. 관광지 질문은 관광지 데이터를 참고한다.
6. 문화시설 질문은 문화시설 데이터를 참고한다.
7. 쇼핑 질문은 쇼핑 데이터를 참고한다.
8. 레포츠 질문은 레포츠 데이터를 참고한다.
9. 여행코스 질문은 여행코스 데이터를 참고한다.

데이터:
${context}
`
          },
          {
            role: "user",
            content: question
          }
        ]
      })
    }
  );

  const result = await response.json();

  console.log(result);

  if (!response.ok) {
    return result.error?.message || "OpenAI 오류";
  }

  return result.choices[0].message.content;
}