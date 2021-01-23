extern crate pest;
#[macro_use]
extern crate pest_derive;

use pest::Parser;

#[derive(Parser)]
#[grammar = "csv.pest"]
pub struct CSVParser;

use serde::{Serialize, Deserialize};
use wasm_bindgen::prelude::*;

#[derive(Serialize, Deserialize)]
pub struct Field {
    pub value: f32,
}

#[derive(Serialize, Deserialize)]
pub struct Record {
    pub fields: Vec<Field>,
}

#[wasm_bindgen]
pub fn parse(source: &str) -> JsValue {
  let file = CSVParser::parse(Rule::File, source)
    .expect("unsuccessful parse") // unwrap the parse result
    .next().unwrap(); // get and unwrap the `file` rule; never fails

  let mut records = vec!();

  for record in file.into_inner() {
    match record.as_rule() {
      Rule::Record => {
        let fields = record.into_inner().map(|field| {
          Field {
            value: field.as_str().parse::<f32>().unwrap()
          }
        }).collect();

        records.push(Record {
          fields
        })
      }
      Rule::EOI => (),
      _ => unreachable!(),
    }
  }

  JsValue::from_serde(&records).unwrap()
}

#[wasm_bindgen]
pub fn store(js_objects: JsValue) -> JsValue {
  let records: Vec<Record> = js_objects.into_serde().unwrap();

  let value = records
    .iter()
    .map(|record| {
      record
        .fields
        .iter()
        .map(|field| {
          field.value.to_string()
        })
        .collect::<Vec<_>>()
        .join(",")
    })
    .collect::<Vec<_>>()
    .join("\n");

  JsValue::from_serde(&value).unwrap()
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn parse_works() {
    assert_eq!(parse("1,2,3\n"), 6.0);
  }
}
