const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const KeyTokenService = require("./keyToken.service");
const ShopService = require("./shop.service");
const { createTokenPair, verifyJWT } = require("@src/auth/authUtils");
const { getInfoData, keyGenerate } = require("@src/utils");
const {
  BadRequestError,
  AuthFailureError,
} = require("@src/core/error.response");
const { ForbiddenError } = require("../core/error.response");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
class AccessService {
  static handleRefreshToken = async (refreshToken) => {
    const foundToken = await KeyTokenService.findByUsedRefreshToken(
      refreshToken
    );
    if (foundToken) {
      const { userId, email } = verifyJWT(refreshToken, foundToken.privateKey);
      console.log("userId", userId);
      console.log("email", email);
      await KeyTokenService.deleteKeyTokenByUserId(userId);
      throw new ForbiddenError("please login again!");
    }

    const keyTokenHolder = await KeyTokenService.findByRefreshToken({
      refreshToken,
    });

    if (!keyTokenHolder) throw new AuthFailureError("Shop not registered!");
    const { userId, email } = await verifyJWT(
      refreshToken,
      keyTokenHolder.privateKey
    );
    const foundShop = await ShopService.findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not registered!");
    const tokens = await createTokenPair(
      { userId, email },
      keyTokenHolder.publicKey,
      keyTokenHolder.privateKey
    );
   
    // Assuming keyTokenHolder is the document instance you've fetched
    keyTokenHolder.refreshToken = tokens.refreshToken; // Directly set the new refreshToken
    keyTokenHolder.refreshTokensUsed.addToSet(refreshToken); // Use addToSet method available on Mongoose arrays

    // Now save the updated document
    await keyTokenHolder.save();

    return {
      user: { userId, email },
      tokens,
    };
  };

  static logout = async ({ keyStore }) => {
    
    return await KeyTokenService.deleteKeyToken(keyStore._id);
  };

  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await ShopService.findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop not registered!");

    const match = bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Authentication Error!");

    const { privateKey, publicKey } = keyGenerate();
    const { _id: userId } = foundShop;

    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );
    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId,
    });
    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };
  static signUp = async ({ name, email, password }) => {
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Error: Shop already registered");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });
    if (newShop) {
      // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      //     modulusLength: 4096,
      //     publicKeyEncoding: {
      //         type: "pkcs1",
      //         format: 'pem'
      //     },
      //     privateKeyEncoding: {
      //         type: "pkcs1",
      //         format: 'pem'
      //     }
      // })

      const { privateKey, publicKey } = keyGenerate();

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError("Keystore Error");
      }

      // const publicKeyObject = crypto.createPublicKey(publicKeyString);

      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AccessService;
