//
//  String+Conversion.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-01-23.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Foundation
import SwiftMoment

// MARK: - Date

extension String {
    func toDate() -> Date? {
        return moment(self)?.date
    }
}

// MARK: - Money

extension String {
    func toMoney() -> Money? {
        guard
            let currency = CurrencyCode(rawValue: String(prefix(3))),
            let amount = Int(dropFirst(3))
        else {
            return nil
        }
        return Money(currency: currency, amount: amount)
    }
}

// MARK: - Email

fileprivate let emailFormat = try! NSRegularExpression(pattern: "^.+@.+\\..+$")

extension String {
    var isEmail: Bool {
        return emailFormat.firstMatch(in: self, range: NSRange(location: 0, length: self.utf16.count)) != nil
    }
}
