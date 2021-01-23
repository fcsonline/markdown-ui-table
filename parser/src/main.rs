extern crate pest;
#[macro_use]
extern crate pest_derive;

use std::fs;
use pest::Parser;

#[derive(Parser)]
#[grammar = "csv.pest"]
pub struct CSVParser;

fn main() {
    let successful_parse = CSVParser::parse(Rule::Field, "-273.15");
    println!("{:?}", successful_parse);

    let unparsed_file = fs::read_to_string("./samples/test.csv").expect("cannot read file");

    let file = CSVParser::parse(Rule::File, &unparsed_file)
      .expect("unsuccessful parse") // unwrap the parse result
      .next().unwrap(); // get and unwrap the `file` rule; never fails


    println!("AST: {:?}", file);
}
