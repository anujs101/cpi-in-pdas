use solana_program::{
    account_info::{next_account_info, AccountInfo},entrypoint, entrypoint::{ ProgramResult}, native_token::LAMPORTS_PER_SOL, program::invoke_signed, pubkey::Pubkey, system_instruction::create_account,
};
entrypoint!(process_instruction);

fn process_instruction(
    program_id:&Pubkey,
    accounts:&[AccountInfo],
    _instruction_data:&[u8]
)->ProgramResult{
    let mut iter = accounts.iter();
    let payer_acc = next_account_info(&mut iter)?;
    let pda_acc = next_account_info(&mut iter)?;
    let system_acc = next_account_info(&mut iter)?;
    let seeds = [b"client",payer_acc.key.as_ref()];
    let (pda,bump)= Pubkey::find_program_address(&seeds, program_id);

    let ix = create_account(
&payer_acc.key,
 &pda_acc.key,
            LAMPORTS_PER_SOL,
     8,
     program_id,
    );
       invoke_signed(
        &ix,
        &[payer_acc.clone(), pda_acc.clone(), system_acc.clone()],
        &[&[b"client", payer_acc.key.as_ref(), &[bump]]],
    )?;
    Ok(())
}