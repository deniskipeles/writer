import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import FormData from 'form-data';
// import { v4 as uuidv4 } from 'uuid';

const BARD_HOST = "bard.google.com";
const BARD_URL = "https://bard.google.com/";
const STREAM_GENERATE_URL = "https://bard.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate";

const HEADERS: Record<string, string> = {
  "Host": BARD_HOST,
  "X-Same-Domain": "1",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
  "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
  "Origin": BARD_URL,
  "Referer": BARD_URL
};

interface BardAnswer {
  content: string;
  conversation_id: string;
  response_id: string;
  factualityQueries: unknown[];
  textQuery: string;
  choices: { id: string; content: string; }[];
}

class Bard {
  private token: string;
  private timeout: number;
  private proxies: Record<string, string>;
  private reqId: number;
  private conversationId: string;
  private responseId: string;
  private choiceId: string;
  private client: AxiosInstance;
  private SNlM0e: string;

  constructor(token: string | null = null, timeout = 20, proxies: Record<string, string> | null = null, session: AxiosInstance | null = null) {
    this.token = token || process.env._BARD_API_KEY || '';
    this.timeout = timeout;
    this.proxies = proxies || {};
    this.reqId = Math.floor(Math.random() * 9000) + 1000;
    this.conversationId = '';
    this.responseId = '';
    this.choiceId = '';
    this.client = session || axios.create();
    this.SNlM0e = '';
  }

  private async getSnim0eAsync(): Promise<string> {
    if (!this.token.endsWith('.')) {
      throw new Error("__Secure-1PSID value must end with a single dot. Enter correct __Secure-1PSID value.");
    }

    const headers: Record<string, string> = {
      ...HEADERS,
      Cookie: `__Secure-1PSID=${this.token}`
    };

    try {
      const response: AxiosResponse<string> = await this.client.get(BARD_URL, { headers });
      const responseBody = response.data;
      const match = responseBody.match(/SNlM0e":"(.*?)"/);
      if (!match) {
        throw new Error("SNlM0e value not found in response. Check __Secure-1PSID value.");
      }
      return match[1];
    } catch (error) {
      throw new Error(`Failed to retrieve SNlM0e value: ${error.message}`);
    }
  }

  public async getAnswer(inputText: string): Promise<BardAnswer> {
    const headers: Record<string, string> = {
      ...HEADERS,
      Cookie: `__Secure-1PSID=${this.token}`
    };

    const parameters: Record<string, string> = {
      _reqid: this.reqId.toString(),
      rt: "c"
    };

    const inputTextStruct = [
      [
        [inputText],
        null,
        [this.conversationId, this.responseId, this.choiceId]
      ]
    ];

    const data: Record<string, string> = {
      "f.req": `[null,'[[\\"${inputText}\\",null,null,[]],[\\"en\\"],[\\"\\",\\"\\",\\"\\\\"],null,null,null,[0]]']`,
      at: this.SNlM0e
    };

    const form = new FormData();
    for (const [key, value] of Object.entries(data)) {
      form.append(key, value);
    }

    try {
      const response: AxiosResponse<string> = await this.client.post(STREAM_GENERATE_URL + this.getQueryString(parameters), form, { headers });
      const responseContent = response.data;
      const responseSubstring = responseContent.substring(responseContent.indexOf("wrb.fr") - 3, responseContent.indexOf("\"]]\"]]") - 4);
      const responseArray = JSON.parse(responseSubstring);
      const parsedAnswer = responseArray[0][2];
      if (parsedAnswer === null) {
        return { content: `Response Error: ${responseContent}.` };
      }

      const choices = responseArray[4].map((choice: any) => ({ id: choice[0], content: choice[1] }));

      const bardAnswer: BardAnswer = {
        content: responseArray[0][0],
        conversation_id: responseArray[1][0],
        response_id: responseArray[1][1],
        factualityQueries: responseArray[3],
        textQuery: responseArray[2][0]?.toString() || "",
        choices: choices
      };

      this.conversationId = bardAnswer.conversation_id;
      this.responseId = bardAnswer.response_id;
      this.choiceId = choices[0]?.id || "";
      this.reqId += 100000;

      return bardAnswer;
    } catch (error) {
      throw new Error(`Failed to get answer: ${error.message}`);
    }
  }

  private getQueryString(parameters: Record<string, string>): string {
    const queryString = Object.entries(parameters)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    return `?${queryString}`;
  }
}

export default Bard;
