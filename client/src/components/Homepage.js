import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import React from "react";
import { ethers } from "ethers";
import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import "./Homepage.css";
import "./FileUpload.css";
import FileUpload from "./FileUpload";


const Secondpage = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    let isRequestingAccounts = false;
    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });

        if (!isRequestingAccounts) {
          isRequestingAccounts = true;
          try {
            // await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            setAccount(address);
            let contractAddress = "0x3d2aAecF743e62C202F0Ef1189B7A49C65d038ed";
            const contract = new ethers.Contract(contractAddress, Upload.abi, signer);
            setContract(contract);
            setProvider(provider);
          } catch (error) {
            console.error("Error requesting accounts:", error);
          } finally {
            isRequestingAccounts = false;
          }
        }
      } else {
        console.error("Metamask is not installed");
      }
    };

    provider && loadProvider();
  }, []);



  const [currentButton, setCurrentButton] = useState("upload");

  const handleUploadClick = () => {
    setCurrentButton("upload");
  };

  return (
    <>
      {/* Navbar section */}
      <div className="navbar-section">
        <Navbar />
      </div>

      <div className="file-container">
        <h1> Store Your Files with Ease</h1>
        <FileUpload
          account={account}
          provider={provider}
          contract={contract}
        ></FileUpload>
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            className="uploaded-files"
            onClick={() =>
              window.location.href = "https://app.pinata.cloud/ipfs/files"
            }
            
          >
            Uploaded Files
          </button>
        </div>
      </div>
    </>
  );
};

export default Secondpage;
