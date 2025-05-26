import bcrypt from "bcryptjs";
import { Schema, model } from "mongoose";
import { Credential } from "../models/credential";

const credentialSchema = new Schema<Credential>({
  username: { type: String, required: true, trim: true },
  hashedPassword: { type: String, required: true }
}, { collection: "user_credentials" });

const credentialModel = model<Credential>("Credential", credentialSchema);

function create(username: string, password: string): Promise<Credential> {
  return credentialModel
    .find({ username })
    .then(found => {
      if (found.length) throw new Error(`Username exists: ${username}`);
    })
    .then(() =>
      bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hashedPassword => {
          const creds = new credentialModel({ username, hashedPassword });
          return creds.save();
        })
    );
}

function verify(username: string, password: string): Promise<string> {
  return credentialModel
    .find({ username })
    .then((found) => {
      console.log("Found credentials:", found);
      if (!found || found.length !== 1)
        throw "Invalid username or password";
      return found[0];
    })
    .then((credsOnFile: Credential) =>
      bcrypt.compare(password, credsOnFile.hashedPassword).then((result: boolean) => {
        console.log("Password match?", result);
        if (!result) throw "Invalid username or password";
        return credsOnFile.username;
      })
    );
}



export default { create, verify };
