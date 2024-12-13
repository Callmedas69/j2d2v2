"use client";

import React, { useState } from "react";
import { translate, isNogs } from "../../../engine/src/index";

const TranslateComponent: React.FC = () => {
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  const [outputLabel, setOutputLabel] = useState<string>("");
  const [inputLabel, setInputLabel] = useState<string>("");
  const [replaceSpaces, setReplaceSpaces] = useState<boolean>(false);

  const maxLength = outputText.length < 280 ? 280 : 1024;

  const handleTranslate = async (text: string) => {
    const translatedText = await translate(text);
    setOutputText(translatedText);
    const isNogsText = isNogs(text);
    setOutputLabel(text ? (!isNogsText ? "⌐◨◨" : "⌐▦▦") : "");
    setInputLabel(text ? (isNogsText ? "⌐◨◨" : "⌐▦▦") : "");
    if (isNogsText) {
      setReplaceSpaces(false);
    }
  };

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    let text = event.target.value;
    if (replaceSpaces && !isNogs(text)) {
      text = text.replace(/ /g, "-");
    }
    setInputText(text);
    await handleTranslate(text);
  };

  const handlePaste = async () => {
    let text = await navigator.clipboard.readText();
    if (replaceSpaces && !isNogs(text)) {
      text = text.replace(/ /g, "-");
    }
    setInputText(text);
    await handleTranslate(text);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
  };

  const handleClear = async () => {
    setInputText("");
    await handleTranslate("");
  };

  const handleSwap = async () => {
    let text = outputText;
    if (replaceSpaces && !isNogs(text)) {
      text = text.replace(/ /g, "-");
    }
    setInputText(text);
    await handleTranslate(text);
  };

  const handleCastToWarpcast = () => {
    const urlRegex =
      /(https?:\/\/[^\s]+)|((?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])/gi;
    const matches = outputText.match(urlRegex) || [];

    const embedUrls = matches.map((url) => {
      if (!url.startsWith("http")) {
        return `https://${url}`;
      }
      return url;
    });

    let warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(
      outputText
    )}&channelKey=basednouns`;

    if (embedUrls.length > 0) {
      warpcastUrl += embedUrls
        .map((url) => `&embeds[]=${encodeURIComponent(url)}`)
        .join("");
    }
    window.open(warpcastUrl, "_blank");
  };

  const handlePostToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      outputText
    )}`;
    window.open(twitterUrl, "_blank");
  };

  const handleReplaceSpacesChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (isNogs(inputText)) {
      return;
    }
    const newReplaceSpaces = e.target.checked;
    setReplaceSpaces(newReplaceSpaces);

    // Update existing input text based on new setting
    const updatedText = newReplaceSpaces
      ? inputText.replace(/ /g, "-")
      : inputText.replace(/-/g, " ");
    setInputText(updatedText);
    await handleTranslate(updatedText);
  };

  return (
    <div style={{ maxWidth: "64ch", margin: "0 auto" }}>
      {/* INPUT */}
      <header>
        <div className="flex flex-col justify-start items-start w-full">
          {/* INPUT LABEL - Aligned to left */}
          <div className="flex-none">
            <label>{inputLabel ? `${inputLabel} ` : "Input"}:</label>
          </div>

          {/* BUTTONS - Aligned to right */}
          <div className="flex flex-row gap-3">
            <label className="flex items-center border border-gray-400 rounded-lg px-5 py-2 text-sm hover:bg-[#182e6f] hover:text-[#e5e3d9] cursor-pointer">
              <input
                type="checkbox"
                checked={replaceSpaces}
                onChange={handleReplaceSpacesChange}
                disabled={isNogs(inputText)}
              />
              <span className="pl-2">Hyphenate</span>
            </label>

            <button
              onClick={handleClear}
              disabled={!outputText}
              className="border border-gray-400 bg-transparent rounded-lg px-5 py-2 text-sm hover:bg-[#182e6f] hover:text-[#e5e3d9] cursor-pointer"
            >
              Clear
            </button>

            <button
              onClick={handlePaste}
              className="border border-gray-400 bg-transparent rounded-lg px-5 py-2 text-sm hover:bg-[#182e6f] hover:text-[#e5e3d9] cursor-pointer"
            >
              Paste
            </button>
          </div>
        </div>
      </header>
      <textarea
        value={inputText}
        onChange={handleInputChange}
        placeholder={
          (replaceSpaces
            ? "write-or-paste-your-text-here"
            : "write or paste your text here") +
          "\n\n◧◨▢ ▢◩ ◩◧ ◨▢ ◪◨ ▢◧ ▢◩ ▢◨ ◧◧ ◧▢ ◨▢ ◪◨ ▢◧◨ ▢◧ ◪▢ ▢◩ ◨▢ ◪◨ ◧▢◨ ◨▢ ◪◪ ◪◨ ▢◩ ◪◨"
        }
        className=" border-gray-400"
      />

      {/* OUTPUT */}
      <header className="flex flex-row justify-between items-center">
        {/* OUTPUT LABEL */}
        <div>
          <label>{outputLabel ? `${outputLabel} ` : "Output"}:</label>
        </div>

        {/* BUTTONS */}
        <div>
          <button
            onClick={handleSwap}
            disabled={!outputText}
            className="border border-gray-400 bg-transparent rounded-lg px-5 py-2 justify-between items-center text-sm hover:bg-[#182e6f] hover:text-[#e5e3d9] cursor-pointer"
          >
            Swap
          </button>
          <button
            onClick={handleCopy}
            disabled={!outputText}
            className="border border-gray-400 bg-transparent rounded-lg px-5 py-2 justify-between items-center text-sm ml-3 hover:bg-[#182e6f] hover:text-[#e5e3d9] cursor-pointer"
          >
            Copy
          </button>
        </div>
      </header>

      {/* TEXT AREA */}
      <textarea value={outputText} readOnly className=" border-gray-400" />

      {/* CHARACTER AND POST */}
      <header>
        <div className="flex flex-row justify-between items-start w-full">
          {/* NUMBER OF CHARACTER */}
          <div>
            <label>
              {outputText.length} / {maxLength}
            </label>
          </div>

          {/* BUTTONS CAST AND X */}
          <div>
            <button
              onClick={handleCastToWarpcast}
              disabled={!outputText || outputText.length > 1024}
              className="border border-gray-400 bg-transparent rounded-lg px-5 py-2 justify-between items-center text-sm hover:bg-[#7c65c1] hover:text-[#e5e3d9] cursor-pointer"
            >
              Cast
            </button>
            <button
              onClick={handlePostToTwitter}
              disabled={!outputText || outputText.length > 280}
              className="border border-gray-400 bg-transparent rounded-lg px-5 py-2 justify-between items-center text-sm ml-3 hover:bg-[#000000] hover:text-[#e5e3d9] cursor-pointer"
            >
              X
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default TranslateComponent;
