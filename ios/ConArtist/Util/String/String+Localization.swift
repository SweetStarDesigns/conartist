//
//  String+Localization.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-03-04.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Foundation

postfix operator ¡

var cachedLocalizations: [String: Toml] = [:]

/// Provides custom localization of strings, rather than using NSLocalizedString, so that the localization files can
/// be shared across platforms.
///
/// TODO: might want to instead compile the localization files to Localizable.strings files at build time
extension String {
    /// Localizes the current string using the given locale
    ///
    /// -   Parameters:
    ///     -   locale: The locale to localize to
    /// -   Returns: the localized version of the string, or nil if there is no stored translation
    func localize(_ locale: String) -> String? {
        return localize([locale])
    }

    /// Localizes the current string into the first langauge that has a translation. Defaults to the user's language
    /// setting from the server, or to the device language setting.
    ///
    /// -   Parameters:
    ///     -   locales: The locales to localize to, prioritizing earlier options
    /// -   Returns: the localized version of the string, or nil if there is no stored translation
    func localize(_ locales: [String] = ConArtist.model.settings.value.language) -> String? {
        return locales.isEmpty
            ? nil
            : locales.first
                .flatMap { locale in locale.contains("-") ? localize(twoPart: locale) : localize(onePart: locale) }
                ?? localize(Array(locales.dropFirst()))
    }

    private func localize(from path: String?) -> String? {
        return path
            .flatMap { path -> Toml? in
                if cachedLocalizations[path] == nil {
                    guard let toml = try? Toml(contentsOfFile: path) else {
                        return nil
                    }
                    cachedLocalizations[path] = toml
                }
                return cachedLocalizations[path]
            }
            .flatMap { toml in
                if let string = toml.string(self) {
                    return string
                } else if let table = toml.table(self) {
                    return table.string("ios")
                }
                return nil
            }
    }

    private func localize<S: StringProtocol>(onePart locale: S) -> String? {
        return localize(from: Bundle.main.path(forResource: "localization/en", ofType: "toml"))
        // return localize(from: Bundle.main.path(forResource: "localization/\(locale)", ofType: "toml"))
    }

    private func localize(twoPart locale: String) -> String? {
        return localize(onePart: locale)
            ?? localize(onePart: locale.split(separator: "-").first!)
            ?? localize(onePart: "en")
    }

    static postfix func ¡(_ string: String) -> String { return string.localize() ?? string }
}
