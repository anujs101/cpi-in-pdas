import {test,expect} from "bun:test";
import { LiteSVM } from "litesvm";
import { Buffer } from "buffer";
import {
	PublicKey,
	Transaction,
	SystemProgram,
	Keypair,
	LAMPORTS_PER_SOL,
	TransactionInstruction,
} from "@solana/web3.js";


test("one transfer", () => {
	const svm = new LiteSVM();
	const payer = Keypair.generate();
	svm.airdrop(payer.publicKey, BigInt(2*LAMPORTS_PER_SOL));
    const programId = Keypair.generate();
    svm.addProgramFromFile(programId.publicKey,"../target/contract.so");
    const seeds = [Buffer.from("client"), payer.publicKey.toBuffer()];
    const [pda,bump]=PublicKey.findProgramAddressSync(seeds,programId.publicKey);
	const ixs = new TransactionInstruction({
        keys:[
            {pubkey: payer.publicKey, isSigner:true,isWritable:true},
            {pubkey: pda, isSigner:false,isWritable:true},
            {pubkey: SystemProgram.programId, isSigner:false,isWritable:false}
        ],
        programId: programId.publicKey,
        data:Buffer.from(""),
    })
	const tx = new Transaction();
	tx.recentBlockhash = svm.latestBlockhash();
	tx.add(ixs);
    tx.feePayer=payer.publicKey;
	tx.sign(payer);
	let res = svm.sendTransaction(tx);
    console. log (res.toString())
        test ("should create pda", () => {
            const balance = svm.getBalance(pda);
            console.log(balance);
            expect(Number(balance)).toBeGreaterThan(0);
            // expect(Number(balance)).toBe(1000000000);
        });
});
