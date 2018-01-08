//! Simple error type
use std::error::Error;
use std::fmt::{Display, Debug, Formatter, Result};

#[derive(Debug)]
pub struct StringError(pub String);

impl Display for StringError {
    fn fmt(&self, f: &mut Formatter) -> Result {
        Debug::fmt(self, f)
    }
}

impl Error for StringError {
    fn description(&self) -> &str { &*self.0 }
}

#[derive(Debug)]
pub struct MoneyError(pub String);

impl Display for MoneyError {
    fn fmt(&self, f: &mut Formatter) -> Result {
        Debug::fmt(self, f)
    }
}

impl Error for MoneyError {
    fn description(&self) -> &str { &*self.0 }
}
